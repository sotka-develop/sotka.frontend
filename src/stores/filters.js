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
  const permitted_uses = ref([]);

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
      const res = await fetch(`${baseUrl}/filters/filters_data`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${auth.token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Ошибка загрузки фильтров: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      bidd_forms.value = (data.bidd_forms || []).map((item) => {
        return {
          text: item.bidd_form,
          value: item.id,
        };
      });
      categories.value = (data.categories || []).map((item) => {
        return {
          text: item.category,
          value: item.id,
        };
      });
      etp_codes.value = (data.etp_codes || []).map((item) => {
        return {
          text: item.etp_code,
          value: item.id,
        };
      });
      regions.value = (data.regions || []).map((item) => {
        return {
          text: item.region,
          value: item.id,
        };
      });
      rubrics.value = (data.rubrics || []).map((item) => {
        return {
          text: item.rubric,
          value: item.id,
        };
      });
      permitted_uses.value = (data.permitted_uses || []).map((item) => {
        return {
          text: item.permitted_use,
          value: item.id,
        };
      });

      console.log(data);
    } catch (err) {
      console.error('Ошибка при загрузке фильтров:', err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    loadFilters,
    bidd_forms,
    categories,
    etp_codes,
    regions,
    rubrics,
    permitted_uses,
  };
});
