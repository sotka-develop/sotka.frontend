<template>
  <main>
    sotka.frontend
    <div>
      <RouterLink to="/map">Поиск земельных участков</RouterLink>

      <br />
      <br />

      <button type="button" @click="logout">
        <span>logout</span>
      </button>
    </div>
  </main>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();

  const authStore = useAuthStore();

  const userData = computed(() => {
    return authStore.user || '';
  });

  async function logout() {
    try {
      await authStore.logout();

      const redirect = route.query.redirect || '/login';
      router.replace(redirect);
    } catch (error) {
      console.warn(error);
    }
  }
</script>
