import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { webpackBundler } from '@vuepress/bundler-webpack'
import { viteBundler } from '@vuepress/bundler-vite'
import { slimsearchPlugin } from '@vuepress/plugin-slimsearch'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { getDirname, path } from 'vuepress/utils'
// import { demoblockPlugin } from 'vuepress-plugin-codeblock-next'
// import { demoblockPlugin } from '../../../plugins/vuepress-plugin-codeblock-next/dist/node/index.mjs'
import { demoblockPlugin } from '../../plugins/vuepress-plugin-codeblock-next/dist/node/index.mjs'


const isWebpack = process.env.DOCS_BUNDLER === 'webpack'

export default defineUserConfig({
  themeConfig: {
    navbar: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: '配置', link: '/config/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          collapsible: true,
          children: ['/guide/README.md', '/guide/get-started.md']
        }
      ],
      '/config/': [
        {
          text: '配置',
          collapsible: true,
          children: ['/config/README.md', '/config/basic.md']
        }
      ]
    }
  },
  lang: 'en-US',

  title: 'VuePress',
  description: 'My first VuePress Site',

  theme: defaultTheme({
    logo: 'https://vuejs.press/images/hero.png',

    navbar: ['/', '/get-started'],
  }),

  bundler: isWebpack ? webpackBundler({
    chainWebpack: (config) => {
      config.module
        .rule('jsx')
        .test(/\.jsx$/)
        .use('babel-loader')
        .loader('babel-loader')
        .options({
          configFile: path.resolve(__dirname, '../../babel.config.cjs'),
          presets: ['@babel/preset-env'],
          plugins: ['@vue/babel-plugin-jsx']
        });
    }
  }) : viteBundler(),

  port: 8090,

  plugins: [
    slimsearchPlugin({
      // 配置项
    }),
    demoblockPlugin({
      // 配置项
    }),
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
    }),

  ],
  resolve: {
    alias: {
    },
    extensions: ['.js', '.jsx', '.ts', '.vue', 'mjs']
  }
})
