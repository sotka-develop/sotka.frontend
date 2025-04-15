import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

import '@/assets/scss/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { vuetify } from './plugins/vuetify';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

import { useAuthStore } from '@/stores/auth';

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  auth.isLoading = true;

  next();
});

router.afterEach(() => {
  const auth = useAuthStore();
  auth.isLoading = false;
});

async function init() {
  const auth = useAuthStore();

  if (auth.token) {
    try {
      await auth.fetchUserData();
    } catch (error) {
      await auth.logout();
    }
  }

  app.use(router);
  app.use(vuetify);
  app.mount('#app');
}

init();
