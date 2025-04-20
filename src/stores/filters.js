// stores/filters.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const useFiltersStore = defineStore('filters', () => {
  const bidd_forms = ref([]);
  const categories = ref([]);
  const etp_codes = ref([]);
  const regions = ref([]);
  const rubrics = ref([]);

  const isLoading = ref(false);
  const error = ref(null);

  // Получение фильтров
  async function loadFilters() {
    const auth = useAuthStore();

    if (!auth.token) {
      error.value = 'Отсутствует токен авторизации.';
      console.warn(error.value);
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const res = await fetch(`${baseUrl}/client/filters/filters_data`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${auth.token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Ошибка загрузки фильтров: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      bidd_forms.value = (data?.payload?.bidd_forms || []).map((item) => {
        return {
          text: item.bidd_form,
          value: item.id,
        };
      });
      categories.value = (data?.payload?.categories || []).map((item) => {
        return {
          text: item.category,
          value: item.id,
        };
      });
      etp_codes.value = (data?.payload?.etp_codes || []).map((item) => {
        return {
          text: item.etp_code,
          value: item.id,
        };
      });
      regions.value = (data?.payload?.regions || []).map((item) => {
        return {
          text: item.region,
          value: item.id,
        };
      });
      rubrics.value = (data?.payload?.rubrics || []).map((item) => {
        return {
          text: item.rubric,
          value: item.id,
        };
      });
    } catch (err) {
      console.error('Ошибка при загрузке фильтров:', err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  // ВРИ
  async function searchPermittedUses(query = '', limit = 10, offset = 0) {
    const auth = useAuthStore();
    const result = ref([]);

    if (!auth.token) {
      console.warn('Нет токена для запроса permitted uses');

      return result;
    }

    try {
      const url = new URL(`${baseUrl}/client/filters/search_permitted_use`);
      url.searchParams.append('query', query);
      url.searchParams.append('limit', limit);
      url.searchParams.append('offset', offset);

      const res = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${auth.token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Ошибка поиска ВРИ: ${res.statusText}`);
      }

      const data = await res.json();

      if (!data.payload) return result;

      result.value = (data.payload || []).map((item) => ({
        text: item.permitted_use,
        value: item.id,
      }));
    } catch (err) {
      console.error('Ошибка при поиске ВРИ:', err);
    }

    return result;
  }

  return {
    loadFilters,
    searchPermittedUses,
    bidd_forms,
    categories,
    etp_codes,
    regions,
    rubrics,
  };
});
