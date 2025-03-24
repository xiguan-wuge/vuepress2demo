const { stripScript, stripTemplate, genInlineComponentText } = require('../util');

module.exports = (md) => {
  md.use((markdown) => {
    markdown.renderer.rules.html_block = (tokens, idx) => {
      const content = tokens[idx].content;
      if (/^<preview>/.test(content)) {
        const template = stripScript(stripTemplate(content));
        const script = genInlineComponentText(content, '');
        return `
          <demo-block>
            <template #source>
              ${template}
            </template>
            ${script}
          </demo-block>
        `;
      }
      return content;
    };
  });
};