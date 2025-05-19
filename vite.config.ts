import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
const config = loadEnv('development', './')
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/styles/index.scss";', // 引入全局变量
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: config.VITE_API_BASE_URL, //跨域地址
        changeOrigin: true, //支持跨域
        rewrite: (path) => path.replace(/^\/api/, "")//重写路径,替换/api
      }
    }
  }
})
