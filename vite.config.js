import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import vuetify from 'vite-plugin-vuetify';
import svgLoader from 'vite-svg-loader';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/',
  server: {
    port: 3000,
  },
  plugins: [
    vue(),
    vueDevTools(),
    vuetify({
      autoImport: true,
    }),
    svgLoader({
      defaultImport: 'component',
      svgo: false,
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'rubrics',
          dest: '',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/scss/vars/index.scss";
          @import "@/assets/scss/mixins/index.scss";
        `,
        silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'mixed-decls'],
      },
    },
  },
});
