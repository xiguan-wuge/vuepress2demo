# vuepress-plugin-codeblock-next

基于vuepress-plugin-demoblock-plus对长期支持版本的vuepress2.0x进行适配

## 特性

- 支持 VuePress 2.x (^2.0.0-rc.7)
- 支持在 Markdown 中直接编写 Vue 示例
- 支持代码块的展开/收起/复制
- 支持 自定义组件/第三方组件

## 安装

```bash
npm install vuepress-plugin-codeblock-next
```

## 使用

在你的 VuePress 配置文件中添加插件：

```js
import { demoblockPlugin } from 'vuepress-plugin-codeblock-next'

export default {
  plugins: [
    demoblockPlugin({
      // 配置项
    })
  ]
}
```

## License

[MIT](./LICENSE)