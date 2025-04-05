import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Login from '../views/Login.vue';

import DefaultLayout from '@/layouts/Default.vue';
import AuthLayout from '@/layouts/Auth.vue';

import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Главная',
        requiresAuth: true,
        layout: DefaultLayout,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: 'Авторизация',
        layout: AuthLayout,
      },
    },
  ],
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();

  // Если пользователь уже авторизован и заходит на страницу логина
  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'home' }; // редирект на главную страницу
  }

  // Если маршрут требует авторизации, но пользователь не авторизован
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }; // редирект на страницу логина
  }

  // Если пользователь авторизован, но данных нет, делаем запрос /me
  // if (authStore.isAuthenticated && !authStore.user) {
  //   try {
  //     await authStore.fetchUserData();
  //   } catch (error) {
  //     console.error('Ошибка загрузки данных пользователя');

  //     authStore.logout(); // если запрос не удался, очищаем токен
  //     return { name: 'login' }; // редирект на страницу логина
  //   }
  // }
});

export default router;
