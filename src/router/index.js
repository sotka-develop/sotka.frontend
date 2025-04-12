import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Views
import MainView from '../views/MainView.vue';
import LoginView from '../views/LoginView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

// Layouts
import DefaultLayout from '@/layouts/Default.vue';
import AuthLayout from '@/layouts/Auth.vue';

const routes = [
  {
    path: '/main',
    name: 'main',
    component: MainView,
    meta: {
      title: 'Главная',
      requiresAuth: true,
      layout: DefaultLayout,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      title: 'Вход',
      layout: AuthLayout,
      guestOnly: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: {
      layout: null,
      title: '404',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from) => {
  const auth = useAuthStore();

  // Защита от неавторизованного доступа
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    };
  }

  // Защита от доступа к /login если уже авторизован
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'main' };
  }

  return true;
});

export default router;
