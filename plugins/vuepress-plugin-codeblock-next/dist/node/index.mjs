import { path } from '@vuepress/utils';
import shiki from '@vuepress/plugin-shiki';
import mdContainer from 'markdown-it-container';
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc';
import os from 'os';
import { createSfcRegexp, TAG_NAME_TEMPLATE } from '@mdit-vue/plugin-sfc';
import { fileURLToPath } from 'url';
import 'fs';

const ScriptSetupPattern = /<(script)(?:.* \bsetup\b)?[^>]*>([\s\S]+)<\/\1>/;
const StylePattern = /<(style)[^>]*>([\s\S]+)<\/\1>/;
const ScriptOrStyleReplacePattern = /<(script|style)[\s\S]+<\/\1>/g;
const TemplateReplacePattern = /<template>([\s\S]+)<\/template>/g;

// 提取Vue单文件组件中的<script>部分
// 使用正则匹配setup语法，通过Vue编译器解析组件选项
function stripScript(content, id) {
  const result = content.match(ScriptSetupPattern);
  const source = result && result[0] ? result[0].trim() : "";
  if (source) {
    const { descriptor } = parse(source);
    const { content: scriptContent } = compileScript(descriptor, {
      refSugar: true,
      id
    });
    return scriptContent;
  }
  return source;
}
function stripStyle(content) {
  const result = content.match(StylePattern);
  return result && result[2] ? result[2].trim() : "";
}
function stripTemplate(content) {
  content = content.trim();
  if (!content) {
    return content;
  }
  return content.replace(ScriptOrStyleReplacePattern, "").trim();
}
function pad(source) {
  return source.split(/\r?\n/).map((line) => `  ${line}`).join("\n");
}
// 生成内联Vue组件代码
// 1. 编译模板为render函数 2. 处理脚本的导入替换 3. 组合成可执行的IIFE
function genInlineComponentText(id, template, script, options) {
  let source = template;
  if (TemplateReplacePattern.test(source)) {
    source = source.replace(TemplateReplacePattern, "$1");
  }
  const finalOptions = {
    id: `inline-component-${id}`,
    source: `${source}`,
    filename: `inline-component-${id}`,
    compilerOptions: {
      mode: "function",
      // 添加JSX语法支持
      jsx: true
    }
  };
  const compiled = compileTemplate(finalOptions);
  if (compiled.tips && compiled.tips.length) {
    compiled.tips.forEach((tip) => {
      console.warn(tip);
    });
  }
  if (compiled.errors && compiled.errors.length) {
    console.error(
      `
  Error compiling template:
${pad(compiled.source)}
` + compiled.errors.map((e) => `  - ${e}`).join("\n") + "\n"
    );
  }
  let demoComponentContent = `
    ${compiled.code.replace("return function render", "function render")}
  `;
  script = script.trim();
  if (script) {
    script = script.replace(/export\s+default/, "const democomponentExport =").replace(/import ({.*}) from 'vue'/g, (s, s1) => `const ${s1} = Vue`).replace(
      /const ({ defineComponent as _defineComponent }) = Vue/g,
      (s, s1) => `const { defineComponent: _defineComponent } = Vue`
    );
    if (options?.scriptReplaces) {
      for (const s of options.scriptReplaces) {
        script = script.replace(s.searchValue, s.replaceValue);
      }
    }
  } else {
    script = "const democomponentExport = {}";
  }
  demoComponentContent = `(function() {
    ${demoComponentContent}
    ${script}
    return {
      render,
      ...democomponentExport
    }
  })()`;
  return demoComponentContent;
}

let seed = 0;
// 核心渲染处理器
// 1. 解析:::demo语法块 2. 生成组件实例 3. 构建页面级组件
const render = (content, options) => {
  if (!content) {
    return;
  }
  const startTag = "<!--vue-demo:";
  const startTagLen = startTag.length;
  const endTag = ":vue-demo-->";
  const endTagLen = endTag.length;
  let componenetsString = "";
  const templateArr = [];
  let styleArr = [];
  let id = 0;
  let start = 0;
  let commentStart = content.indexOf(startTag);
  let commentEnd = content.indexOf(endTag, commentStart + startTagLen);
  while (commentStart !== -1 && commentEnd !== -1) {
    templateArr.push(content.slice(start, commentStart));
    const commentContent = content.slice(commentStart + startTagLen, commentEnd);
    const html = stripTemplate(commentContent);
    const script = stripScript(commentContent, `render-demo-${id}-script`);
    const style = stripStyle(commentContent);
    seed = seed + 1;
    const demoComponentContent = genInlineComponentText(seed, html, script, options);
    const demoComponentName = `render-demo-${id}`;
    templateArr.push(`<${demoComponentName} />`);
    styleArr.push(style);
    componenetsString += `${JSON.stringify(demoComponentName)}: ${demoComponentContent},`;
    id++;
    start = commentEnd + endTagLen;
    commentStart = content.indexOf(startTag, start);
    commentEnd = content.indexOf(endTag, commentStart + startTagLen);
  }
  let pageScript = "";
  if (componenetsString) {
    pageScript = `<script lang="ts">
      import * as Vue from 'vue'
      ${options?.scriptImports?.join(os.EOL)}
      export default {
        name: 'component-doc',
        components: {
          ${componenetsString}
        }
      }
    <\/script>`;
  } else if (content.indexOf("<script>") === 0) {
    start = content.indexOf("<\/script>") + "<\/script>".length;
    pageScript = content.slice(0, start);
  }
  styleArr = [...new Set(styleArr)];
  let styleString = "";
  const preprocessors = ["scss", "sass", "less", "stylus"];
  let _style = "style";
  if (preprocessors.includes(options.cssPreprocessor)) {
    _style = `style lang="${options.cssPreprocessor}"`;
  }
  if (options.customStyleTagName) {
    _style = options.customStyleTagName;
  }
  if (styleArr && styleArr.length > 0) {
    styleString = `<${_style}>${styleArr.join("")}</style>`;
  } else {
    styleString = `<style></style>`;
  }
  templateArr.push(content.slice(start));
  return {
    template: templateArr.join(""),
    script: pageScript,
    style: styleString
  };
};

// markdown-it容器插件
// 将:::demo语法转换为<demo>自定义组件
const blockPlugin = (md, options) => {
  md.use(mdContainer, "demo", {
    validate(params) {
      return params.trim().match(/^demo\s*(.*)$/);
    },
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        const content = tokens[idx + 1].type === "fence" ? tokens[idx + 1].content : "";
        return `<demo customClass="${options.customClass}" sourceCode="${md.utils.escapeHtml(
          content
        )}">${content ? `<!--vue-demo:${content}:vue-demo-->` : ""}`;
      }
      return "</demo>";
    }
  });
};
// 代码块处理插件
// 1. 匹配vue语言块 2. 分离描述和代码 3. 集成Shiki高亮
const codePlugin = (md, options) => {
  const lang = options?.lang || "vue";
  const defaultRender = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, idx, options2, env, self) => {
    const token = tokens[idx];
    const prevToken = tokens[idx - 1];
    const isInDemoContainer = prevToken && prevToken.nesting === 1 && prevToken.info.trim().match(/^demo\s*(.*)$/);
    if (token.info.trim() === lang && isInDemoContainer) {
      const m = prevToken.info.trim().match(/^demo\s*(.*)$/);
      const description = m && m.length > 1 ? m[1] : "";
      return `
        ${description ? `<template #description>
          <div>${md.renderInline(description)}</div>
        </template>` : ""}
        <template #highlight>
          <div v-pre class="language-${lang}">
            ${md.options.highlight?.(token.content, lang, "") || ""}
          </div>
        </template>`;
    }
    return defaultRender?.(tokens, idx, options2, env, self);
  };
};
const sfcRegexp = createSfcRegexp({ customBlocks: [TAG_NAME_TEMPLATE] });
// 整体渲染流程控制
// 1. 拦截原始渲染 2. 注入SFC区块 3. 返回处理后的模板
const renderPlugin = (md, options) => {
  const render$1 = md.render.bind(md);
  md.render = (src, env) => {
    let rendered = render$1(src, env);
    const startTag = "<!--vue-demo:";
    const endTag = ":vue-demo-->";
    if (rendered.indexOf(startTag) !== -1 && rendered.indexOf(endTag) !== -1) {
      const { template, script, style } = render(rendered, options) || {};
      const templateSfcBlock = `<template>${template}</template>`.match(sfcRegexp)?.groups;
      const scriptSfcBlock = script?.match(sfcRegexp)?.groups;
      const styleSfcBlock = style?.match(sfcRegexp)?.groups;
      env.sfcBlocks.template = templateSfcBlock || null;
      env.sfcBlocks.script = scriptSfcBlock || null;
      if (styleSfcBlock) {
        env.sfcBlocks.styles.push(styleSfcBlock);
      }
      rendered = template;
    }
    return rendered;
  };
};
// 插件主入口
// 组合三个核心处理插件：容器解析、代码处理、渲染控制
const demoblock = (md, options = {}) => {
  md.use(blockPlugin, options);
  md.use(codePlugin, options);
  md.use(renderPlugin, options);
};

const getDirname = (importMetaUrl) => path.dirname(fileURLToPath(importMetaUrl));

const __dirname = getDirname(import.meta.url);
const defaultLocales = {
  "/": {
    "hide-text": "\u9690\u85CF\u4EE3\u7801",
    "show-text": "\u663E\u793A\u4EE3\u7801",
    "copy-button-text": "\u590D\u5236\u4EE3\u7801\u7247\u6BB5",
    "copy-success-text": "\u590D\u5236\u6210\u529F"
  }
};
const demoblockPlugin = ({
  locales = {},
  customClass = "",
  theme = "css-variables",
  langs,
  lang = "vue",
  cssPreprocessor,
  scriptImports = [],
  scriptReplaces = []
} = {}) => {
  return {
    name: "vuepress-plugin-codeblock-next",
    clientConfigFile: path.resolve(__dirname, `../client/config${process.env.npm_package_config_configExt || ".mjs"}`),
    extendsMarkdown: async (md) => {
      await shiki({ theme, langs }).extendsMarkdown(md);
      md.use(demoblock, {
        customClass,
        lang,
        cssPreprocessor,
        scriptImports,
        scriptReplaces
      });
    },
    define: {
      __DEMOBLOCK_LOCALES__: { ...defaultLocales, ...locales }
    }
  };
};

export { blockPlugin, codePlugin, demoblockPlugin as default, demoblock, demoblockPlugin, renderPlugin };
