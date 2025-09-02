import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import viteImagemin from 'vite-plugin-imagemin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 65 }, // lower quality for smaller files
      pngquant: { quality: [0.5, 0.7], speed: 4 },
      svgo: {
        plugins: [
          { name: 'removeViewBox' },
          { name: 'removeEmptyAttrs', active: false },
        ],
      },
      // Modern formats
      webp: { quality: 75 }, // great balance for web
    }),
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
