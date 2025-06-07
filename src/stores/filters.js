// stores/filters.js
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useAuthStore } from './auth';
import { debounce } from 'lodash';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const useFiltersStore = defineStore('filters', () => {
  const isLoading = ref(false);
  const filtersReadyLoading = ref(false);
  const error = ref(null);
  const permittedUsesPending = ref(false);
  const permittedUsesNspdPending = ref(false);
  const permittedUseshideNoData = ref(true);

  // 1) Регион
  const regionsByDistricts = ref([]);

  // 4) Вид торгов
  const biddTypes = ref([]);

  // 5) Вид сделки
  const transactionTypes = ref(['Аренда', 'Безвозмездное пользование', 'Иное', 'Продажа']);

  // 8) Форма проведения
  const biddForms = ref([]);

  // 9) ЭТП
  const etpCodes = ref([]);

  // 12) Сравн. S (TG и КН)
  const tgToKn = ref(['норма', 'нюанс <95%', 'нюанс >105%']);

  // 13) Составность
  const compositions = ref(['Кад. номер', 'Кад. квартал', 'Кад. район', 'Коорд. не определены']);

  // 24) Категория
  const categories = ref([]);

  const rubrics = ref([]);

  // ВРИ
  const usesData = ref([]);

  // ВРИ НСДП
  const usesNspdData = ref([]);

  // Флаг для отслеживания изменений
  const isDirty = ref(false);

  // v-model

  // 1) Регион
  const regionsByDistrictsModel = ref([]);

  // 2) Начало пдч.заяв. от
  const biddStartTimeFromModel = ref(null);

  // 3) Начало пдч.заяв. до
  const biddStartTimeToModel = ref(null);

  // 4) Вид торгов
  const biddTypesModel = ref([]);

  // 5) Вид сделки
  const transactionTypesModel = ref([]);

  // 6) Окнч.пдч.заяв. от
  const biddEndTimeFromModel = ref(null);

  // 7) Окнч.пдч.заяв. до
  const biddEndTimeToModel = ref(null);

  // 8) Форма проведения
  const biddFormsModel = ref([]);

  // 9) ЭТП
  const etpCodesModel = ref([]);

  // 10) Извещение, лот
  const lotModel = ref('');

  // 11) Кадастр. номер
  const cadasterNumberModel = ref('');

  // 12 Сравн. S (TG и КН)
  const tgToKnModel = ref([]);

  // 13) Составность
  const compositionsModel = ref(['Кад. квартал', 'Кад. район', 'Кад. номер']);

  // 14) % НЦ /КС (более)
  const priceRatioFromModel = ref(null);

  // 15) % НЦ /КС (менее)
  const priceRatioToModel = ref(null);

  // 16) Нач. цена, р (более)
  const priceMinFromModel = ref(null);

  // 17) Нач. цена, р (менее)
  const priceMinToModel = ref(null);

  // 18) К. стоим-ть (более)
  const cadastralCostFromModel = ref(null);

  // 19) К. стоим-ть (менее)
  const cadastralCostToModel = ref(null);

  // 20) Задаток, р (более)
  const depositFromModel = ref(null);

  // 21) Задаток, р (менее)
  const depositToModel = ref(null);

  // 22) Задаток, % (более)
  const depositPercentFromModel = ref(null);

  // 23) Задаток, % (менее)
  const depositPercentToModel = ref(null);

  // 24) Категория
  const categoriesModel = ref([]);

  // 25) Площадь, м2 (более)
  const areaFromModel = ref(null);

  // 26) Площадь, м2 (менее)
  const areaToModel = ref(null);

  // 27) ВРИ
  const useModel = ref([]);

  // 28) Рубрика
  const rubricsModel = ref([]);

  // 29) Категория НСПД
  const categoriesNspdModel = ref([]);

  // 30) Площадь, м2 (более) НСПД
  const areaFromNspdModel = ref(null);

  // 31) Площадь, м2 (менее) НСПД
  const areaToNspdModel = ref(null);

  // 32) ВРИ
  const useNspdModel = ref([]);

  // 33) Рубрика
  const rubricsNspdModel = ref([]);

  // Дефолтные значения для сравнения
  const defaultValues = {
    // 1) Регион
    regionsByDistrictsModel: [],

    // 2) Начало пдч.заяв. от
    biddStartTimeFromModel: null,

    // 3) Начало пдч.заяв. до
    biddStartTimeToModel: null,

    // 4) Вид торгов
    biddTypesModel: [],

    // 5) Вид сделки
    transactionTypesModel: [],

    // 6) Окнч.пдч.заяв. от
    biddEndTimeFromModel: null,

    // 7) Окнч.пдч.заяв. до
    biddEndTimeToModel: null,

    // 8) Форма проведения
    biddFormsModel: [],

    // 9) ЭТП
    etpCodesModel: [],

    // 10) Извещение, лот
    lotModel: '',

    // 11) Кадастр. номер
    cadasterNumberModel: '',

    // 12) Сравн. S (TG и КН)
    tgToKnModel: [],

    // 13) Составность
    compositionsModel: ['Кад. квартал', 'Кад. район', 'Кад. номер'],

    // 14) % НЦ /КС (более)
    priceRatioFromModel: null,

    // 15) % НЦ /КС (менее)
    priceRatioToModel: null,

    // 16) Нач. цена, р (более)
    priceMinFromModel: null,

    // 17) Нач. цена, р (менее)
    priceMinToModel: null,

    // 18) К. стоим-ть (более)
    cadastralCostFromModel: null,

    // 19) К. стоим-ть (менее)
    cadastralCostToModel: null,

    // 20) Задаток, р (более)
    depositFromModel: null,

    // 21) Задаток, р (менее)
    depositToModel: null,

    // 22) Задаток, % (более)
    depositPercentFromModel: null,

    // 23) Задаток, % (менее)
    depositPercentToModel: null,

    // 24 Категория
    categoriesModel: [],

    // 25) Площадь, м2 (более)
    areaFromModel: null,

    // 26) Площадь, м2 (менее)
    areaToModel: null,

    // 27) ВРИ
    useModel: [],

    // 28) Рубрика
    rubricsModel: [],

    // 29) Категория НСПД
    categoriesNspdModel: [],

    // 30) Площадь, м2 (более) НСПД
    areaFromNspdModel: null,

    // 31) Площадь, м2 (менее) НСПД
    areaToNspdModel: null,

    // 32) ВРИ
    useNspdModel: [],

    // 33) Рубрика
    rubricsNspdModel: [],
  };

  // Список моделей для отслеживания
  const models = [
    // 1) Регион
    regionsByDistrictsModel,

    // 2) Начало пдч.заяв. от
    biddStartTimeFromModel,

    // 3) Начало пдч.заяв. до
    biddStartTimeToModel,

    // 4) Вид торгов
    biddTypesModel,

    // 5) Вид сделки
    transactionTypesModel,

    // 6) Окнч.пдч.заяв. от
    biddEndTimeFromModel,

    // 7) Окнч.пдч.заяв. до
    biddEndTimeToModel,

    // 8) Форма проведения
    biddFormsModel,

    // 9) ЭТП
    etpCodesModel,

    // 10) Извещение, лот
    lotModel,

    // 11) Кадастр. номер
    cadasterNumberModel,

    // 12) Сравн. S (TG и КН)
    tgToKnModel,

    // 13) Составность
    compositionsModel,

    // 14) % НЦ /КС (более)
    priceRatioFromModel,

    // 15) % НЦ /КС (менее)
    priceRatioToModel,

    // 16) Нач. цена, р (более)
    priceMinFromModel,

    // 17) Нач. цена, р (менее)
    priceMinToModel,

    // 18) К. стоим-ть (более)
    cadastralCostFromModel,

    // 19) К. стоим-ть (менее)
    cadastralCostToModel,

    // 20) Задаток, р (более)
    depositFromModel,

    // 21) Задаток, р (менее)
    depositToModel,

    // 22) Задаток, % (более)
    depositPercentFromModel,

    // 23) Задаток, % (менее)
    depositPercentToModel,

    // 24) Категория
    categoriesModel,

    // 25) Площадь, м2 (более)
    areaFromModel,

    // 26) Площадь, м2 (менее)
    areaToModel,

    // 27) ВРИ
    useModel,

    // 28) Рубрика
    rubricsModel,

    // 29) Категория НСПД
    categoriesNspdModel,

    // 30) Площадь, м2 (более) НСПД
    areaFromNspdModel,

    // 31) Площадь, м2 (менее) НСПД
    areaToNspdModel,

    // 32) ВРИ
    useNspdModel,

    // 33) Рубрика
    rubricsNspdModel,
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
      isDirty.value = models.some((model, index) => {
        const key = Object.keys(defaultValues)[index];

        return !isEqual(model.value, defaultValues[key]);
      });
    },
    { deep: true }
  );

  // Сброс фильтров до дефолтных значений
  function resetFilters() {
    // 1) Регион
    regionsByDistrictsModel.value = defaultValues.regionsByDistrictsModel;

    // 2) Начало пдч.заяв. от
    biddStartTimeFromModel.value = defaultValues.biddStartTimeFromModel;

    // 3) Начало пдч.заяв. до
    biddStartTimeToModel.value = defaultValues.biddStartTimeToModel;

    // 4) Вид торгов
    biddTypesModel.value = defaultValues.biddTypesModel;

    // 5) Вид сделки
    transactionTypesModel.value = defaultValues.transactionTypesModel;

    // 6) Окнч.пдч.заяв. от
    biddEndTimeFromModel.value = defaultValues.biddEndTimeFromModel;

    // 7) Окнч.пдч.заяв. до
    biddEndTimeToModel.value = defaultValues.biddEndTimeToModel;

    // 8) Форма проведения
    biddFormsModel.value = defaultValues.biddFormsModel;

    // 9) ЭТП
    etpCodesModel.value = defaultValues.etpCodesModel;

    // 10) Извещение, лот
    lotModel.value = defaultValues.lotModel;

    // 11) Кадастр. номер
    cadasterNumberModel.value = defaultValues.cadasterNumberModel;

    // 12) Сравн. S (TG и КН)
    tgToKnModel.value = defaultValues.tgToKnModel;

    // 13) Составность
    compositionsModel.value = defaultValues.compositionsModel;

    // 14) % НЦ /КС (более)
    priceRatioFromModel.value = defaultValues.priceRatioFromModel;

    // 15) % НЦ /КС (менее)
    priceRatioToModel.value = defaultValues.priceRatioToModel;

    // 16) Нач. цена, р (более)
    priceMinFromModel.value = defaultValues.priceMinFromModel;

    // 17) Нач. цена, р (менее)
    priceMinToModel.value = defaultValues.priceMinToModel;

    // 18) К. стоим-ть (более)
    cadastralCostFromModel.value = defaultValues.cadastralCostFromModel;

    // 19) К. стоим-ть (менее)
    cadastralCostToModel.value = defaultValues.cadastralCostToModel;

    // 20) Задаток, р (более)
    depositFromModel.value = defaultValues.depositFromModel;

    // 21) Задаток, р (менее)
    depositToModel.value = defaultValues.depositToModel;

    // 22) Задаток, % (более)
    depositPercentFromModel.value = defaultValues.depositPercentFromModel;

    // 23) Задаток, % (менее)
    depositPercentToModel.value = defaultValues.depositPercentToModel;

    // 24) Категория
    categoriesModel.value = defaultValues.categoriesModel;

    // 25) Площадь, м2 (более)
    areaFromModel.value = defaultValues.areaFromModel;

    // 26) Площадь, м2 (менее)
    areaToModel.value = defaultValues.areaToModel;

    // 27) ВРИ
    useModel.value = defaultValues.useModel;

    // 28) Рубрика
    rubricsModel.value = defaultValues.rubricsModel;

    // 29) Категория НСПД
    categoriesNspdModel.value = defaultValues.categoriesNspdModel;

    // 30) Площадь, м2 (более) НСПД
    areaFromNspdModel.value = defaultValues.areaFromNspdModel;

    // 31) Площадь, м2 (менее) НСПД
    areaToNspdModel.value = defaultValues.areaFromNspdModel;

    // 32) ВРИ НСПД
    useNspdModel.value = defaultValues.useNspdModel;

    // 33) Рубрика НСПД
    rubricsNspdModel.value = defaultValues.rubricsNspdModel;

    isDirty.value = false;
  }

  const onSearchPermittedUses = debounce(async (event) => {
    const value = event?.target?.value || '';

    permittedUsesPending.value = true;
    const result = await searchPermittedUses(value, 1000, 0, 'torgi_gov');
    usesData.value = result.value;
  }, 800);

  const onSearchPermittedUsesNspd = debounce(async (event) => {
    const value = event?.target?.value || '';

    permittedUsesNspdPending.value = true;
    const result = await searchPermittedUses(value, 1000, 0, 'nspd');
    usesNspdData.value = result.value;
  }, 800);

  const fieldsData = ref([
    {
      name: 'region_ids',
      label: 'Регион',
      hideDetails: true,
      model: regionsByDistrictsModel,
      type: 'treeselect',
      items: regionsByDistricts,
      clearable: false,
      placeholder: 'Регион, область, город',
      multiple: true,
    },
    {
      name: 'bidd_start_time_from',
      label: 'Начало пдч.заяв. от',
      hideDetails: true,
      clearable: true,
      model: biddStartTimeFromModel,
      type: 'date',
      placeholder: '--.--.--',
    },
    {
      name: 'bidd_start_time_to',
      label: 'Начало пдч.заяв. до',
      hideDetails: true,
      clearable: true,
      model: biddStartTimeToModel,
      type: 'date',
      placeholder: '--.--.--',
    },
    {
      name: 'bidd_type_ids',
      label: 'Вид торгов',
      hideDetails: true,
      model: biddTypesModel,
      type: 'autocomplete',
      items: biddTypes,
      placeholder: 'Выбрать значение',
      multiple: true,
    },
    {
      name: 'transaction_types',
      label: 'Вид сделки',
      hideDetails: true,
      model: transactionTypesModel,
      type: 'autocomplete',
      items: transactionTypes,
      placeholder: 'Выбрать значение',
      multiple: true,
    },
    {
      name: 'bidd_end_time_from',
      label: 'Окнч.пдч.заяв. от',
      hideDetails: true,
      clearable: true,
      model: biddEndTimeFromModel,
      type: 'date',
      placeholder: '--.--.--',
    },
    {
      name: 'bidd_end_time_to',
      label: 'Окнч.пдч.заяв. до',
      hideDetails: true,
      clearable: true,
      model: biddEndTimeToModel,
      type: 'date',
      placeholder: '--.--.--',
    },
    {
      name: 'bidd_form_ids',
      label: 'Форма проведения',
      hideDetails: true,
      model: biddFormsModel,
      type: 'autocomplete',
      items: biddForms,
      placeholder: 'Выбрать значение',
      multiple: true,
    },
    {
      name: 'etp_codes_ids',
      label: 'ЭТП',
      hideDetails: true,
      model: etpCodesModel,
      type: 'autocomplete',
      items: etpCodes,
      placeholder: 'Выбрать значение',
      multiple: true,
    },
    {
      name: 'lot',
      label: 'Извещение, лот',
      hideDetails: true,
      model: lotModel,
      type: 'text',
      placeholder: 'Например, 1111',
    },
    {
      name: 'cadaster_number',
      label: 'Кадастровый номер',
      hideDetails: true,
      model: cadasterNumberModel,
      type: 'text',
      placeholder: 'Например, 1111',
    },
    {
      name: 'tg_to_kn_area_ratio',
      label: 'Сравн. S (TG и КН)',
      hideDetails: true,
      model: tgToKnModel,
      type: 'autocomplete',
      items: tgToKn,
      placeholder: 'Выбрать значение',
      multiple: true,
    },
    {
      name: 'compositions',
      label: 'Составность',
      hideDetails: true,
      model: compositionsModel,
      type: 'autocomplete',
      items: compositions,
      placeholder: 'Выбрать значение',
      multiple: true,
    },
    {
      name: 'price_min_cadastral_cost_ratio_percent_from',
      label: '% НЦ /КС (более)',
      hideDetails: true,
      model: priceRatioFromModel,
      type: 'number',
      placeholder: 'Например, 1111',
      precision: 0,
    },
    {
      name: 'price_min_cadastral_cost_ratio_percent_to',
      label: '% НЦ /КС (менее)',
      hideDetails: true,
      model: priceRatioToModel,
      type: 'number',
      placeholder: 'Например, 1111',
      precision: 0,
    },
    {
      name: 'price_min_from',
      label: 'Нач. цена, р (более)',
      hideDetails: true,
      model: priceMinFromModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
    {
      name: 'price_min_to',
      label: 'Нач. цена, р (менее)',
      hideDetails: true,
      model: priceMinToModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
    {
      name: 'cadastral_cost_from',
      label: 'К. стоим-ть (более)',
      hideDetails: true,
      model: cadastralCostFromModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
    {
      name: 'cadastral_cost_to',
      label: 'К. стоим-ть (менее)',
      hideDetails: true,
      model: cadastralCostToModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
    {
      name: 'deposit_from',
      label: 'Задаток, р (более)',
      hideDetails: true,
      model: depositFromModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
    {
      name: 'deposit_to',
      label: 'Задаток, р (менее)',
      hideDetails: true,
      model: depositToModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
    {
      name: 'deposit_percent_from',
      label: 'Задаток, % (более)',
      hideDetails: true,
      model: depositPercentFromModel,
      type: 'number',
      placeholder: 'Например, 1111',
      precision: 0,
    },
    {
      name: 'deposit_percent_to',
      label: 'Задаток, % (менее)',
      hideDetails: true,
      model: depositPercentToModel,
      type: 'number',
      placeholder: 'Например, 1111',
      precision: 0,
    },
    {
      split: 'Характеристики земельного участка (согласно torgi.gov) [TG]',
    },
    {
      name: 'categories_ids',
      label: 'Категория',
      hideDetails: true,
      model: categoriesModel,
      type: 'autocomplete',
      items: categories,
      placeholder: 'Выбрать значение',
      multiple: true,
    },
    {
      name: 'area_from',
      label: 'Площадь от',
      hideDetails: true,
      model: areaFromModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
    {
      name: 'area_to',
      label: 'Площадь до',
      hideDetails: true,
      model: areaToModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
    {
      name: 'permitted_uses_id',
      label: 'ВРИ',
      hideDetails: true,
      hideNoData: permittedUseshideNoData,
      model: useModel,
      type: 'autocomplete',
      items: usesData,
      placeholder: 'Выбрать значение',
      multiple: true,
      returnObject: false,
      loading: permittedUsesPending,
      onInput: onSearchPermittedUses,
    },
    {
      name: 'rubrics_ids',
      label: 'Рубрика',
      hideDetails: true,
      model: rubricsModel,
      type: 'autocomplete',
      items: rubrics,
      placeholder: 'Выбрать значение',
      multiple: true,
    },
    {
      split: 'Характеристики земельного участка (по кадастровому номеру) [КН]',
    },
    {
      name: 'categories_nspd_ids',
      label: 'Категория [КН]',
      hideDetails: true,
      model: categoriesNspdModel,
      type: 'autocomplete',
      items: categories,
      placeholder: 'Выбрать значение',
      multiple: true,
    },
    {
      name: 'area_from_nspd_from',
      label: 'Площадь от [КН]',
      hideDetails: true,
      model: areaFromNspdModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
    {
      name: 'area_from_nspd_to',
      label: 'Площадь до [КН]',
      hideDetails: true,
      model: areaToNspdModel,
      type: 'number',
      placeholder: 'Например, 1111',
    },
    {
      name: 'permitted_uses_nspd_id',
      label: 'ВРИ [КН]',
      hideDetails: true,
      hideNoData: permittedUseshideNoData,
      model: useNspdModel,
      type: 'autocomplete',
      items: usesNspdData,
      placeholder: 'Выбрать значение',
      multiple: true,
      returnObject: false,
      loading: permittedUsesNspdPending,
      onInput: onSearchPermittedUsesNspd,
    },
    {
      name: 'rubric_nspd_ids',
      label: 'Рубрика [КН]',
      hideDetails: true,
      model: rubricsNspdModel,
      type: 'autocomplete',
      items: rubrics,
      placeholder: 'Выбрать значение',
      multiple: true,
    },
  ]);

  async function loadInitialPermittedUses() {
    permittedUsesPending.value = true;

    try {
      const result = await searchPermittedUses('', 1000, 0, 'torgi_gov');
      usesData.value = result.value;
    } finally {
      permittedUsesPending.value = false;
    }
  }

  async function loadInitialPermittedUsesNspd() {
    permittedUsesNspdPending.value = true;

    try {
      const result = await searchPermittedUses('', 1000, 0, 'nspd');
      usesNspdData.value = result.value;
    } finally {
      permittedUsesNspdPending.value = false;
    }
  }

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
      biddTypes.value = (data?.payload?.bidd_types || []).map((item) => {
        return {
          text: item.bidd_type,
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
      rubrics.value = (data?.payload?.rubrics || []).map((item) => {
        return {
          text: item.rubric,
          value: item.id,
        };
      });

      // регион
      regionsByDistricts.value = Object.values(
        (data?.payload?.regions || []).reduce((acc, { id, region, federal_district_id, federal_district }) => {
          const districtId = federal_district_id;
          const districtName = federal_district.federal_district;

          if (!acc[districtId]) {
            acc[districtId] = {
              name: districtName,
              id: districtId,
              items: [],
            };
          }

          acc[districtId].items.push({
            text: region,
            value: id,
          });

          return acc;
        }, {})
      );

      // Вызов доп. загрузок после успешной загрузки фильтров
      await Promise.all([loadInitialPermittedUses(), loadInitialPermittedUsesNspd()]);
    } catch (err) {
      console.error('Ошибка при загрузке фильтров:', err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function baseFilters() {
    const auth = useAuthStore();

    if (!auth.token) {
      error.value = 'Отсутствует токен авторизации.';
      console.warn(error.value);

      return;
    }

    filtersReadyLoading.value = true;
    error.value = null;

    try {
      const res = await fetch(`${baseUrl}/client/filters/base_filters`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${auth.token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Ошибка загрузки данныех по доступным фильтрам: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const fields = data?.payload || [];

      fields.forEach((item) => {
        const name = item.name;
        const isAvailable = item.is_available;

        if (name && !isAvailable) {
          const field = fieldsData.value.find((item) => item.name === name);

          if (field) {
            field.disabled = true;
          }
        }
      });
    } catch (err) {
      console.error('Ошибка при загрузке фильтров:', err);
      error.value = err.message;
    } finally {
      filtersReadyLoading.value = false;
    }
  }

  // ВРИ
  async function searchPermittedUses(query = '', limit = 10, offset = 0, source = 'torgi_gov') {
    const auth = useAuthStore();
    const result = ref([]);

    if (!auth.token) {
      console.warn('Нет токена для запроса permitted uses');
      return result;
    }

    try {
      const url = `${baseUrl}/client/filters/search_permitted_use`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${auth.token}`,
        },
        body: JSON.stringify({
          query,
          limit,
          offset,
          source,
        }),
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
    } finally {
      permittedUsesPending.value = false;
      permittedUsesNspdPending.value = false;
    }

    return result;
  }

  function formatDate(model) {
    if (!model?.value) return null;

    const date = new Date(model.value);

    return isNaN(date) ? null : date.toISOString().slice(0, 10);
  }

  function getFormattedFilters() {
    return {
      // 1) Регион
      region_ids: regionsByDistrictsModel.value || [],

      // 2) Начало пдч.заяв. от
      bidd_start_time_from: formatDate(biddStartTimeFromModel),

      // 3) Начало пдч.заяв. до
      bidd_start_time_to: formatDate(biddStartTimeToModel),

      // 4) Вид торгов
      bidd_type_ids: biddTypesModel.value || [],

      // 5) Вид сделки
      transaction_types: transactionTypesModel.value || [],

      // 6) Окнч.пдч.заяв. от
      bidd_end_time_from: formatDate(biddEndTimeFromModel),

      // 7) Окнч.пдч.заяв. до
      bidd_end_time_to: formatDate(biddEndTimeToModel),

      // 8) Форма проведения
      bidd_form_ids: biddFormsModel.value || [],

      // 9) ЭТП
      etp_codes_ids: etpCodesModel.value || [],

      // 10) Извещение, лот
      lot: lotModel.value || null,

      // 11) Кадастр. номер
      cadaster_number: cadasterNumberModel.value?.toString() || null,

      // 12) Сравн. S (TG и КН)
      tg_to_kn_area_ratio: tgToKnModel.value || [],

      // 13) Составность
      compositions: compositionsModel.value || [],

      // 14) % НЦ /КС (более)
      price_min_cadastral_cost_ratio_percent_from: priceRatioFromModel.value || null,

      // 15) % НЦ /КС (менее)
      price_min_cadastral_cost_ratio_percent_to: priceRatioToModel.value || null,

      // 16) Нач. цена, р (более)
      price_min_from: priceMinFromModel.value || null,

      // 17) Нач. цена, р (менее)
      price_min_to: priceMinToModel.value || null,

      // 18) К. стоим-ть (более)
      cadastral_cost_from: cadastralCostFromModel.value || null,

      // 19) К. стоим-ть (менее)
      cadastral_cost_to: cadastralCostToModel.value || null,

      // 20) Задаток, р (более)
      deposit_from: depositFromModel.value || null,

      // 21) Задаток, р (менее)
      deposit_to: depositToModel.value || null,

      // 22) Задаток, % (более)
      deposit_percent_from: depositPercentFromModel.value || null,

      // 23) Задаток, % (менее)
      deposit_percent_to: depositPercentToModel.value || null,

      // 24) Категория
      categories_ids: categoriesModel.value || [],

      // 25) Площадь, м2 (более)
      area_from: areaFromModel.value || null,

      // 26) Площадь, м2 (менее)
      area_to: areaToModel.value || null,

      // 27) ВРИ
      permitted_uses_id: useModel.value || [],

      // 28) Рубрика
      rubrics_ids: rubricsModel.value || [],

      // 29) Категория НСПД
      categories_nspd_ids: categoriesNspdModel.value || [],

      // 30) Площадь, м2 (более) НСПД
      area_from_nspd_from: areaFromNspdModel.value || null,

      // 31) Площадь, м2 (менее) НСПД
      area_from_nspd_to: areaToNspdModel.value || null,

      // 32) ВРИ НСПД
      permitted_uses_nspd_id: useNspdModel.value || [],

      // 33) Рубрика НСПД
      rubric_nspd_ids: rubricsNspdModel.value || [],
    };
  }

  return {
    loadFilters,
    baseFilters,
    searchPermittedUses,
    fieldsData,
    getFormattedFilters,
    resetFilters,
    isDirty,
    filtersReadyLoading,
  };
});
