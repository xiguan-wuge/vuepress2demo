declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    customClass: StringConstructor;
    sourceCode: StringConstructor;
    locales: {
        type: ObjectConstructor;
        required: false;
        default: () => {};
    };
}>, {
    blockClass: import("vue").ComputedRef<string>;
    hover: import("vue").Ref<boolean, boolean>;
    fixedControl: import("vue").Ref<boolean, boolean>;
    isExpanded: import("vue").Ref<boolean, boolean>;
    locale: import("vue").ComputedRef<any>;
    controlText: import("vue").ComputedRef<any>;
    onClickControl: () => void;
    highlight: import("vue").Ref<any, any>;
    description: import("vue").Ref<any, any>;
    meta: import("vue").Ref<any, any>;
    control: import("vue").Ref<any, any>;
    onCopy: () => Promise<void>;
    goCodepen: () => void;
    demoBlock: import("vue").Ref<any, any>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    customClass: StringConstructor;
    sourceCode: StringConstructor;
    locales: {
        type: ObjectConstructor;
        required: false;
        default: () => {};
    };
}>> & Readonly<{}>, {
    locales: Record<string, any>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
