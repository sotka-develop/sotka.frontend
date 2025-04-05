<template>
  <component :is="$route.meta.layout || 'div'">
    <RouterView />
  </component>

  <Loader v-if="authStore.isLoading" />
</template>

<script setup>
  import { onMounted } from 'vue';
  import { RouterView, useRoute } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import Loader from './components/loader/loader.vue';

  const authStore = useAuthStore();
  const route = useRoute();

  onMounted(async () => {
    try {
      if (authStore.token) {
        // проверяем, актуален ли токен
        await authStore.fetchUserData();
      }
    } catch (error) {
      console.warn('Пользователь не авторизован!');
      // токен есть, но он устарел
      authStore.logout();
    }
  });
</script>
