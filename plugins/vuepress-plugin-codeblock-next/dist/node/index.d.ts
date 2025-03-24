import MarkdownIt from 'markdown-it';

interface Locale {
    'hide-text': string;
    'show-text': string;
    'copy-button-text': string;
    'copy-success-text': string;
}
interface Locales {
    [key: string]: Locale;
}
type ReplaceValue = () => string;
interface ScriptReplace {
    searchValue: RegExp;
    replaceValue: string | ReplaceValue;
}
interface DemoblockPluginOptions {
    locales?: Locales;
    customClass?: string;
    theme?: string;
    langs?: any[];
    lang?: string;
    cssPreprocessor?: 'sass' | 'scss' | 'less' | 'stylus';
    customStyleTagName?: string;
    scriptImports?: Array<string>;
    scriptReplaces?: Array<ScriptReplace>;
}

declare const blockPlugin: (md: MarkdownIt, options: DemoblockPluginOptions) => void;
declare const codePlugin: (md: MarkdownIt, options: DemoblockPluginOptions) => void;
declare const renderPlugin: (md: MarkdownIt, options: DemoblockPluginOptions) => void;
declare const demoblock: (md: MarkdownIt, options?: DemoblockPluginOptions) => void;

/**
 * demoblockPlugin
 * @param customClass demoblock classname
 * @param locales i18n
 * @param theme shiki theme css-variables/github-light/github-dark ...
 * @param langs shiki langs
 * @param lang shiki lang
 * @param cssPreprocessor less/scss
 * @param scriptImports
 * @param scriptReplaces
 * @return {{clientConfigFile, name: string, define: {__DEMOBLOCK_LOCALES__: {'/': {'show-text': string, 'copy-success-text': string, 'hide-text': string, 'copy-button-text': string}}}, extendsMarkdown: ((function(*=): Promise<void>)|*)}}
 */
declare const demoblockPlugin: ({ locales, customClass, theme, langs, lang, cssPreprocessor, scriptImports, scriptReplaces }?: DemoblockPluginOptions) => {
    name: string;
    clientConfigFile: string;
    extendsMarkdown: (md: MarkdownIt) => Promise<void>;
    define: {
        __DEMOBLOCK_LOCALES__: {
            '/': {
                'hide-text': string;
                'show-text': string;
                'copy-button-text': string;
                'copy-success-text': string;
            };
        };
    };
};

export { DemoblockPluginOptions, Locale, Locales, ReplaceValue, ScriptReplace, blockPlugin, codePlugin, demoblockPlugin as default, demoblock, demoblockPlugin, renderPlugin };
