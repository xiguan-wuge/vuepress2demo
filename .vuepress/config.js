import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  bundler: '@vuepress/bundler-webpack',
  bundlerConfig: {
    chainWebpack: (config) => {
      config.module
        .rule('scss')
        .test(/\.scss$/)
        .use('sass-loader')
        .loader('sass-loader')
        .end()
      config.module
        .rule('vue')
        .test(/\.vue$/)
        .use('vue-loader')
        .loader('vue-loader')
    }
  }
})