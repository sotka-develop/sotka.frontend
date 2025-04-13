import { setup } from '@storybook/vue3';
import { vuetify } from '../src/plugins/vuetify';

import '@/assets/scss/main.scss';

setup((app) => {
  app.use(vuetify);
});

const customViewports = {
  mobile: {
    name: 'Mobile',
    styles: {
      width: '360px',
      height: '960px',
    },
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1440px',
      height: '1080px',
    },
  },
  fullHD: {
    name: 'fullHD',
    styles: {
      width: '1920px',
      height: '1080px',
    },
  },
};

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: customViewports,
      defaultViewport: 'desktop',
    },
    backgrounds: {
      values: [
        { name: 'Dark', value: '#333' },
        { name: 'White', value: '#fff' },
        { name: 'Grey', value: '#CFCFCF' },
      ],
      default: 'Light',
    },
  },
};

export default preview;
