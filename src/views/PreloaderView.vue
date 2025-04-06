<template>
  <Preloader />
</template>

<script setup>
  import { useAuthStore } from '@/stores/auth';
  import { onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';

  import Preloader from '@/components/Preloader/Preloader.vue';

  const authStore = useAuthStore();
  const router = useRouter();
  const route = useRoute();

  onMounted(async () => {
    if (authStore.token) {
      try {
        await authStore.fetchUserData();

        // редирект на главную, если авторизован
        const redirectTo = route.query.redirect || '/main';
        router.replace(redirectTo);
      } catch (error) {
        await authStore.logout();
        router.replace('/login');
      }
    } else {
      router.replace('/login');
    }
  });
</script>
