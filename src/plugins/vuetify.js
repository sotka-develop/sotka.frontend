import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { ru } from 'vuetify/locale';
import '@mdi/font/css/materialdesignicons.css';

import { VDateInput } from 'vuetify/labs/VDateInput';

export const vuetify = createVuetify({
  components: {
    VDateInput,
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'default',
    themes: {
      default: {
        dark: false,
        colors: {
          primary: '#0968fa',
          surface: '#ffffff',
          background: '#fafcff',
        },
        variables: {},
      },
    },
  },
  locale: {
    locale: 'ru',
    messages: { ru },
  },
});
