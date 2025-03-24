# 指南

欢迎阅读 VuePress 使用指南。这里包含以下内容：

- [快速开始](/guide/get-started.md)
- 进阶用法
- 最佳实践

::: tip
如果你是第一次使用 VuePress，建议你先阅读[快速开始](/guide/get-started.md)。
:::


::: demo 这个常规用法
```vue
<template>
  <div>
    <h1>{{msg}}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello World'
    }
  }
}
</script>
```
:::

## 这是jsx用法
<JsxDemo1></JsxDemo1>
<!-- :::demo
```vue
<script>
export default {
  data() {
    return {
      msg: 'Hello World'
    }
  },
  render() {
    const { msg } = this
    return (
        <h1>{msg}</h1>
    )
  }
}
</script>
```
::: -->