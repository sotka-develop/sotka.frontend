// stores/filters.js
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
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
  const compositions = ref(['Кад. номер', 'Кад. квартал', 'Кад. район', 'Коорд. не определены']);

  // ВРИ
  const usesData = ref([]);

  // Флаг для отслеживания изменений
  const isDirty = ref(false);

  // Дефолтные значения для сравнения
  const defaultValues = {
    biddFormsModel: [],
    categoriesModel: [],
    etpCodesModel: [],
    regionsModel: [],
    rubricsModel: [],
    compositionsModel: ['Кад. квартал', 'Кад. район', 'Кад. номер'],
    biddEndTimeFromModel: null,
    biddEndTimeToModel: null,
    addedAtModel: null,
    cadasterNumberModel: null,
    lotModel: null,
    useModel: [],
    priceMinFromModel: null,
    priceMinToModel: null,
    cadastralCostFromModel: null,
    cadastralCostToModel: null,
    priceRatioFromModel: null,
    priceRatioToModel: null,
    areaFromModel: null,
    areaToModel: null,
  };

  // v-model
  const biddFormsModel = ref([]);
  const categoriesModel = ref([]);
  const etpCodesModel = ref([]);
  const regionsModel = ref([]);
  const rubricsModel = ref([]);
  const compositionsModel = ref(['Кад. квартал', 'Кад. район', 'Кад. номер']);

  const biddEndTimeFromModel = ref(null);
  const biddEndTimeToModel = ref(null);
  const addedAtModel = ref(null);
  const cadasterNumberModel = ref(null);
  const lotModel = ref(null);
  const useModel = ref([]);
  const priceMinFromModel = ref(null);
  const priceMinToModel = ref(null);
  const cadastralCostFromModel = ref(null);
  const cadastralCostToModel = ref(null);
  const priceRatioFromModel = ref(null);
  const priceRatioToModel = ref(null);
  const areaFromModel = ref(null);
  const areaToModel = ref(null);

  // Список моделей для отслеживания
  const models = [
    biddFormsModel,
    categoriesModel,
    etpCodesModel,
    regionsModel,
    rubricsModel,
    compositionsModel,
    biddEndTimeFromModel,
    biddEndTimeToModel,
    addedAtModel,
    cadasterNumberModel,
    lotModel,
    useModel,
    priceMinFromModel,
    priceMinToModel,
    cadastralCostFromModel,
    cadastralCostToModel,
    priceRatioFromModel,
    priceRatioToModel,
    areaFromModel,
    areaToModel,
  ];

  // Функция сравнения значений
  const isEqual = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      // Сравнение как множества, игнорируя порядок
      const setA = new Set(a);
      const setB = new Set(b);
      if (setA.size !== setB.size) return false;
      return [...setA].every((item) => setB.has(item));
    }
    return a === b;
  };

  // Отслеживание изменений в моделях
  watch(
    models,
    () => {
      console.log(models);
      isDirty.value = models.some((model, index) => {
        const key = Object.keys(defaultValues)[index];
        return !isEqual(model.value, defaultValues[key]);
      });
    },
    { deep: true }
  );

  // Сброс фильтров до дефолтных значений
  function resetFilters() {
    biddFormsModel.value = defaultValues.biddFormsModel;
    categoriesModel.value = defaultValues.categoriesModel;
    etpCodesModel.value = defaultValues.etpCodesModel;
    regionsModel.value = defaultValues.regionsModel;
    rubricsModel.value = defaultValues.rubricsModel;
    compositionsModel.value = defaultValues.compositionsModel;
    biddEndTimeFromModel.value = defaultValues.biddEndTimeFromModel;
    biddEndTimeToModel.value = defaultValues.biddEndTimeToModel;
    addedAtModel.value = defaultValues.addedAtModel;
    cadasterNumberModel.value = defaultValues.cadasterNumberModel;
    lotModel.value = defaultValues.lotModel;
    useModel.value = defaultValues.useModel;
    priceMinFromModel.value = defaultValues.priceMinFromModel;
    priceMinToModel.value = defaultValues.priceMinToModel;
    cadastralCostFromModel.value = defaultValues.cadastralCostFromModel;
    cadastralCostToModel.value = defaultValues.cadastralCostToModel;
    priceRatioFromModel.value = defaultValues.priceRatioFromModel;
    priceRatioToModel.value = defaultValues.priceRatioToModel;
    areaFromModel.value = defaultValues.areaFromModel;
    areaToModel.value = defaultValues.areaToModel;

    isDirty.value = false;
  }

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
      model: compositionsModel,
      type: 'autocomplete',
      items: compositions,
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
      precision: 0,
    },
    {
      label: '% нач.ц/кад.стоим. до',
      hideDetails: true,
      model: priceRatioToModel,
      type: 'number',
      placeholder: 'Например, 1111',
      precision: 0,
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
      bidd_form_ids: biddFormsModel.value || [],
      region_ids: regionsModel.value || [],
      etp_codes_ids: etpCodesModel.value || [],
      cadaster_number: cadasterNumberModel.value?.toString() || null,
      lot: lotModel.value || null,
      compositions: compositionsModel.value || [],
      added_at: formatDate(addedAtModel.value),
      rubrics_ids: rubricsModel.value || [],
      categories_ids: categoriesModel.value || [],
      permitted_uses_id: useModel.value || [],
      price_min_from: priceMinFromModel.value || null,
      price_min_to: priceMinToModel.value || null,
      cadastral_cost_from: cadastralCostFromModel.value || null,
      cadastral_cost_to: cadastralCostToModel.value || null,
      price_min_cadastral_cost_ratio_percent_from: priceRatioFromModel.value || null,
      price_min_cadastral_cost_ratio_percent_to: priceRatioToModel.value || null,
      area_from: areaFromModel.value || null,
      area_to: areaToModel.value || null,
    };
  }

  return {
    loadFilters,
    searchPermittedUses,
    fieldsData,
    getFormattedFilters,
    resetFilters,
    isDirty,
  };
});
