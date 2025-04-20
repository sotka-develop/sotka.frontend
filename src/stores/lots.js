import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const useLotsStore = defineStore('lots', () => {
  const lots = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  async function fetchLots(filters) {
    const auth = useAuthStore();

    if (!auth.token) {
      error.value = 'Нет токена';
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const res = await fetch(`${baseUrl}/client/land_areas_by_filter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${auth.token}`,
        },
        body: JSON.stringify(filters),
      });

      if (!res.ok) {
        throw new Error('Ошибка при получении лотов');
      }

      const data = await res.json();

      return data.payload || null;
    } catch (err) {
      error.value = err.message;
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    lots,
    fetchLots,
    isLoading,
    error,
  };
});
