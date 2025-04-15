<template>
  <component :is="$route.meta.layout || 'div'">
    <RouterView />
  </component>
  <Preloader v-if="auth.isLoading" />
</template>

<script setup>
  import Preloader from '@/components/preloader/Preloader.vue';
  import { useAuthStore } from '@/stores/auth';

  const auth = useAuthStore();
</script>
