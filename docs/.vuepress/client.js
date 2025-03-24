import { defineClientConfig } from '@vuepress/client'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import './public/theme/index.scss'
import './public/theme/temp.css';

// import DemoBlock from './components/DemoBlock.vue'

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    import('./public/theme/index.scss')
    app.use(ElementPlus)
    // app.component('DemoBlock', DemoBlock)
    // 应用级别的增强
  },
  setup() {
    // 在Vue应用实例创建之前执行
  },
  rootComponents: [
    // 根组件
  ]
})