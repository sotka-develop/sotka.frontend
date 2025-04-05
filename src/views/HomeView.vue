<template>
  <main>
    sotka.frontend
    <div>
      <pre v-if="userData">
        {{ userData }}
      </pre>
      <button type="button" @click="logout">
        <span>logout</span>
      </button>
    </div>
  </main>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useAuthStore } from '@/stores/auth';

  const authStore = useAuthStore();

  const userData = computed(() => {
    return authStore.user || '';
  });

  async function logout() {
    try {
      await authStore.logout();
    } catch (error) {
      console.warn(error);
    }
  }
</script>
