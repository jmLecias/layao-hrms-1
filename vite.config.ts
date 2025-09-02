import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // raise the warning limit (default 500)
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'], // put vue in its own chunk
          // vendor: [
          //   'axios',
          //   'lodash',
          //   // add other big dependencies here
          // ],
        },
      },
    },
  },
})
