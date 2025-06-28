const yamapKey = import.meta.env.VITE_YAMAP_KEY;

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import 'simplebar-vue/dist/simplebar.min.css';
import '@/assets/scss/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createYmaps } from 'vue-yandex-maps';

import App from './App.vue';
import router from './router';
import { vuetify } from './plugins/vuetify';
import SimpleBar from 'simplebar-vue';
import VueTippy from 'vue-tippy';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(VueTippy);

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
  app.use(
    createYmaps({
      apikey: yamapKey,
    })
  );

  app.component('SimpleBar', SimpleBar);

  app.mount('#app');
}

init();
