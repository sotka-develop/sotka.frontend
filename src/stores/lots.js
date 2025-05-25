import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const useLotsStore = defineStore('lots', () => {
  const lots = ref([]);
  const lotsPending = ref(false);
  const mapPending = ref(false);
  const landAreaPending = ref(false);
  const clusterPending = ref(false);
  const error = ref(null);

  async function fetchLots(filters) {
    const auth = useAuthStore();

    if (!auth.token) {
      error.value = 'Нет токена';
      return;
    }

    lotsPending.value = true;
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
      lotsPending.value = false;
    }
  }

  async function fetchMapData(payload) {
    const auth = useAuthStore();

    if (!auth.token) {
      error.value = 'Нет токена';
      return;
    }

    mapPending.value = true;
    error.value = null;

    try {
      const res = await fetch(`${baseUrl}/client/map/rectangle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${auth.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Ошибка при получении лотов для карты');
      }

      const data = await res.json();

      return data.payload || null;
    } catch (err) {
      error.value = err.message;
      console.error(err);
    } finally {
      mapPending.value = false;
    }
  }

  // данные метки
  async function fetchLandArea(payload) {
    const auth = useAuthStore();

    if (!auth.token) {
      error.value = 'Нет токена';
      return;
    }

    landAreaPending.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams({ land_area_id: payload, get_coords: true });

      const res = await fetch(`${baseUrl}/client/land_area/by_id?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${auth.token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Ошибка при получении данных точки');
      }

      const data = await res.json();

      return data.payload || null;
    } catch (err) {
      error.value = err.message;
      console.error(err);
    } finally {
      landAreaPending.value = false;
    }
  }

  // данные кластера
  async function fetchClusterData(params, pagination) {
    const auth = useAuthStore();

    if (!auth.token) {
      error.value = 'Нет токена';
      return;
    }

    clusterPending.value = true;
    error.value = null;

    try {
      const queryParams = new URLSearchParams({
        page: pagination.page,
        page_size: pagination.page_size,
      });

      const res = await fetch(`${baseUrl}/client/get_lots_in_cluster?${queryParams.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${auth.token}`,
        },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        throw new Error('Ошибка при получении данных кластера');
      }

      const data = await res.json();

      return data.payload || null;
    } catch (err) {
      error.value = err.message;
      console.error(err);
    } finally {
      clusterPending.value = false;
    }
  }

  return {
    fetchLots,
    fetchMapData,
    fetchLandArea,
    fetchClusterData,
    lots,
    lotsPending,
    mapPending,
    landAreaPending,
    clusterPending,
    error,
  };
});
