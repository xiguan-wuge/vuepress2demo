import { defineClientConfig } from '@vuepress/client'

export default defineClientConfig({
  setup() {
    if (__VUEPRESS_DEV__) {
      window.__VUE__.config.errorHandler = (err) => {
        console.error('[Vue Error]', err)
      }
    }
  }
})