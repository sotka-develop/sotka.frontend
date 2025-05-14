// stores/filters.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';
import { debounce } from 'lodash';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const useFiltersStore = defineStore('filters', () => {
  // данные, получаемые через loadFilters
  const biddForms = ref([]);
  const categories = ref([]);
  const etpCodes = ref([]);
  const regions = ref([]);
  const rubrics = ref([]);

  // Составность
  const composition = ref(['Кад. номер', 'Кад. квартал', 'Кад. район', 'Коорд. не определены']);

  // ВРИ
  const usesData = ref([]);

  // v-model
  const biddFormsModel = ref(null);
  const categoriesModel = ref(null);
  const etpCodesModel = ref(null);
  const regionsModel = ref(null);
  const rubricsModel = ref(null);
  const compositionModel = ref(null);

  const biddEndTimeFromModel = ref(null);
  const biddEndTimeToModel = ref(null);
  const addedAtModel = ref(null);
  const cadasterNumberModel = ref(null);
  const lotModel = ref(null);
  const useModel = ref(null);
  const priceMinFromModel = ref(null);
  const priceMinToModel = ref(null);
  const cadastralCostFromModel = ref(null);
  const cadastralCostToModel = ref(null);
  const priceRatioFromModel = ref(null);
  const priceRatioToModel = ref(null);
  const areaFromModel = ref(null);
  const areaToModel = ref(null);

  const onSearchPermittedUses = debounce(async (event) => {
    const value = event?.target?.value || '';

    const result = await searchPermittedUses(value, 50, 0);
    usesData.value = result.value;
  }, 800);

  const fieldsData = [
    {
      label: 'Дата подачи от',
      hideDetails: true,
      model: biddEndTimeFromModel,
      type: 'date',
      placeholder: '--.--.--',
    },
    {
      label: 'Дата подачи до',
      hideDetails: true,
      model: biddEndTimeToModel,
      type: 'date',
      placeholder: '--.--.--',
    },
    {
      label: 'Дата добавления',
      hideDetails: true,
      model: addedAtModel,
      type: 'date',
      placeholder: '--.--.--',
    },
    {
      label: 'Форма торгов',
      hideDetails: true,
      model: biddFormsModel,
      type: 'autocomplete',
      items: biddForms,
      placeholder: 'Выбрать значение',
      multiple: true,
    },
    {
      label: 'Регион',
      hideDetails: true,
      model: regionsModel,
      type: 'autocomplete',
      items: regions,
      placeholder: 'Регион, область, город',
      multiple: true,
    },
    {
      label: 'Код ЭТП',
      hideDetails: true,
      model: etpCodesModel,
      type: 'autocomplete',
      items: etpCodes,
      placeholder: 'Выбрать значение',
      multiple: true,
    },
    {
      label: 'Кадастровый номер',
      hideDetails: true,
      model: cadasterNumberModel,
      type: 'text',
      placeholder: 'Например, 1111',
    },
    {
      label: 'Лот',
      hideDetails: true,
      model: lotModel,
      type: 'text',
      placeholder: 'Например, 1111',
    },
    {
      label: 'Композиция',
      hideDetails: true,
      model: compositionModel,
      type: 'autocomplete',
      items: composition,
      placeholder: 'Выбрать значение',
      multiple: true,
    },
    {
      label: 'Рубрики',
      hideDetails: true,
      model: rubricsModel,
      type: 'autocomplete',
      items: rubrics,
      placeholder: 'Выбрать значение',
      multiple: true,
    },
    {
      label: 'Категория ЗУ',
      hideDetails: true,
      model: categoriesModel,
      type: 'autocomplete',
      items: categories,
      placeholder: 'Выбрать значение',
      multiple: true,
    },
    {
      label: 'ВРИ',
      hideDetails: true,
      model: useModel,
      type: 'autocomplete',
      items: usesData,
      placeholder: 'Выбрать значение',
      multiple: true,
      returnObject: false,
      onInput: onSearchPermittedUses,
    },
    {
      label: 'Цена от',
      hideDetails: true,
      model: priceMinFromModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
    {
      label: 'Цена до',
      hideDetails: true,
      model: priceMinToModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
    {
      label: 'Кад. стоимость от',
      hideDetails: true,
      model: cadastralCostFromModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
    {
      label: 'Кад. стоимость до',
      hideDetails: true,
      model: cadastralCostToModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
    {
      label: '% нач.ц/кад.стоим. от',
      hideDetails: true,
      model: priceRatioFromModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
    {
      label: '% нач.ц/кад.стоим. до',
      hideDetails: true,
      model: priceRatioToModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
    {
      label: 'Площадь от',
      hideDetails: true,
      model: areaFromModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
    {
      label: 'Площадь до',
      hideDetails: true,
      model: areaToModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
  ];

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

      biddForms.value = (data?.payload?.bidd_forms || []).map((item) => {
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
      etpCodes.value = (data?.payload?.etp_codes || []).map((item) => {
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

  function formatDate(model) {
    const date = new Date(model?.value);

    return isNaN(date) ? null : date.toISOString().slice(0, 10);
  }

  function getFormattedFilters() {
    return {
      bidd_end_time_from: formatDate(biddEndTimeFromModel.value),
      bidd_end_time_to: formatDate(biddEndTimeToModel.value),
      added_at: formatDate(addedAtModel.value),
      bidd_forms: biddFormsModel.value || null,
      categories: categoriesModel.value || null,
      etp_codes: etpCodesModel.value || null,
      regions: regionsModel.value || null,
      rubrics: rubricsModel.value || null,
      composition: compositionModel.value || null,
      cadaster_number: cadasterNumberModel.value?.toString() || null,
      lot: lotModel.value || null,
      permitted_use: useModel.value || null,
      price_min_from: priceMinFromModel.value || null,
      price_min_to: priceMinToModel.value || null,
      cadastral_cost_from: cadastralCostFromModel.value || null,
      cadastral_cost_to: cadastralCostToModel.value || null,
      price_ratio_from: priceRatioFromModel.value || null,
      price_ratio_to: priceRatioToModel.value || null,
      area_from: areaFromModel.value || null,
      area_to: areaToModel.value || null,
    };
  }

  return {
    loadFilters,
    searchPermittedUses,
    fieldsData,
    getFormattedFilters,
  };
});
