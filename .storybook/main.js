import { mergeConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import vuetify from 'vite-plugin-vuetify';
import svgLoader from 'vite-svg-loader';

const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        docs: false,
      },
    },
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [
        vuetify({
          autoImport: true,
        }),
        svgLoader({
          defaultImport: 'component',
          svgo: false,
        }),
      ],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('../src', import.meta.url)),
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
  },
};
export default config;
