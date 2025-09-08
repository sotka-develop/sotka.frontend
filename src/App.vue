<template>
  <component :is="$route.meta.layout || 'div'">
    <RouterView />
  </component>

  <Loader v-if="auth.isLoading" />
</template>

<script setup>
  import Loader from '@/components/loader/Loader.vue';
  import { useAuthStore } from '@/stores/auth';

  const auth = useAuthStore();
</script>
