import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
  base: '/',
  server: {
    port: 3000,
    // proxy: {
    //   '/api': {
    //     target: 'http://s0tka2.tw1.ru',
    //     changeOrigin: true,
    //     secure: false,
    //     // опционально: переписывать путь
    //     // rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/scss/vars/index.scss";
          @import "@/assets/scss/mixins/index.scss";
        `,
        silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin'],
      },
    },
  },
});
