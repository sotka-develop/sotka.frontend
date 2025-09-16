// stores/filters.js
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useAuthStore } from './auth';
import { debounce } from 'lodash';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const useFiltersStore = defineStore('filters', () => {
  // 1) Регион
  const filtersDataRegions = ref([]);
  const regionsModel = ref(null);

  // 2) Начало пдч.заяв. от
  const biddStartTimeFromModel = ref(null);

  // 3) Начало пдч.заяв. до
  const biddStartTimeToModel = ref(null);

  // 4) Вид торгов
  const filtersDataBiddTypes = ref([]);
  const biddTypesModel = ref([]);

  // 5) Вид сделки
  const transactionTypes = ref([]);
  const transactionTypesModel = ref([]);

  // 6) Окнч.пдч.заяв. от
  const biddEndTimeFromModel = ref(null);

  // 7) Окнч.пдч.заяв. до
  const biddEndTimeToModel = ref(null);

  // 8) Форма проведения
  const filtersDataBiddForms = ref([]);
  const biddFormsModel = ref([]);

  // 9) ЭТП
  const etpCodes = ref([]);
  const etpCodesModel = ref([]);

  // 10) Извещение, лот
  const lotModel = ref('');

  // 11) Кадастр. номер
  const cadasterNumberModel = ref('');

  // 12) Сравн. S (TG и КН)
  const tgToKn = ref(['норма', 'нюанс <95%', 'нюанс >105%']);
  const tgToKnModel = ref([]);

  // 13) Составность
  const compositions = ref([]);
  const compositionsModel = ref([]);

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
  const filtersDataCategories = ref([]);
  const categoriesModel = ref([]);

  // 25) Площадь, м2 (более)
  const areaFromModel = ref(null);

  // 26) Площадь, м2 (менее)
  const areaToModel = ref(null);

  // 27) ВРИ
  const filtersDataPermittedUses = ref([]);
  const permittedUsesModel = ref([]);
  const permittedUsesPending = ref(false);

  // 28) Рубрика
  const filtersDataRubrics = ref([]);
  const rubricsModel = ref([]);

  // 29) Категория НСПД
  const filtersDataCategoriesNspd = ref([]);
  const categoriesNspdModel = ref([]);

  // 30) Площадь, м2 (более) НСПД
  const areaFromNspdModel = ref(null);

  // 31) Площадь, м2 (менее) НСПД
  const areaToNspdModel = ref(null);

  // 32) ВРИ
  const filtersDataPermittedUsesNspd = ref([]);
  const permittedUsesNspdModel = ref([]);
  const permittedUsesNspdPending = ref(false);

  // 33) Рубрика
  const filtersDataRubricsNspd = ref([]);
  const rubricsNspdModel = ref([]);

  const isLoading = ref(false);
  const filtersReadyLoading = ref(false);
  const error = ref(null);

  // Флаг для отслеживания изменений
  const isDirty = ref(false);

  // Дефолтные значения для сравнения
  const defaultValues = ref({
    // 1) Регион
    regionsModel: null,

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
    compositionsModel: [],
    // compositionsModel: ['Кад. квартал', 'Кад. район', 'Кад. номер'],

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
    permittedUsesModel: [],

    // 28) Рубрика
    rubricsModel: [],

    // 29) Категория НСПД
    categoriesNspdModel: [],

    // 30) Площадь, м2 (более) НСПД
    areaFromNspdModel: null,

    // 31) Площадь, м2 (менее) НСПД
    areaToNspdModel: null,

    // 32) ВРИ
    permittedUsesNspdModel: [],

    // 33) Рубрика
    rubricsNspdModel: [],
  });

  // Список моделей для отслеживания
  const models = [
    // 1) Регион
    regionsModel,

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
    permittedUsesModel,

    // 28) Рубрика
    rubricsModel,

    // 29) Категория НСПД
    categoriesNspdModel,

    // 30) Площадь, м2 (более) НСПД
    areaFromNspdModel,

    // 31) Площадь, м2 (менее) НСПД
    areaToNspdModel,

    // 32) ВРИ
    permittedUsesNspdModel,

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
        const key = Object.keys(defaultValues.value)[index];

        return !isEqual(model.value, defaultValues.value[key]);
      });
    },
    { deep: true }
  );

  // Сброс фильтров до дефолтных значений
  async function resetFilters() {
    // 1) Регион
    regionsModel.value = defaultValues.value.regionsModel;

    // 2) Начало пдч.заяв. от
    biddStartTimeFromModel.value = defaultValues.value.biddStartTimeFromModel;

    // 3) Начало пдч.заяв. до
    biddStartTimeToModel.value = defaultValues.value.biddStartTimeToModel;

    // 4) Вид торгов
    biddTypesModel.value = defaultValues.value.biddTypesModel;

    // 5) Вид сделки
    transactionTypesModel.value = defaultValues.value.transactionTypesModel;

    // 6) Окнч.пдч.заяв. от
    biddEndTimeFromModel.value = defaultValues.value.biddEndTimeFromModel;

    // 7) Окнч.пдч.заяв. до
    biddEndTimeToModel.value = defaultValues.value.biddEndTimeToModel;

    // 8) Форма проведения
    biddFormsModel.value = defaultValues.value.biddFormsModel;

    // 9) ЭТП
    etpCodesModel.value = defaultValues.value.etpCodesModel;

    // 10) Извещение, лот
    lotModel.value = defaultValues.value.lotModel;

    // 11) Кадастр. номер
    cadasterNumberModel.value = defaultValues.value.cadasterNumberModel;

    // 12) Сравн. S (TG и КН)
    tgToKnModel.value = defaultValues.value.tgToKnModel;

    // 13) Составность
    compositionsModel.value = defaultValues.value.compositionsModel;

    // 14) % НЦ /КС (более)
    priceRatioFromModel.value = defaultValues.value.priceRatioFromModel;

    // 15) % НЦ /КС (менее)
    priceRatioToModel.value = defaultValues.value.priceRatioToModel;

    // 16) Нач. цена, р (более)
    priceMinFromModel.value = defaultValues.value.priceMinFromModel;

    // 17) Нач. цена, р (менее)
    priceMinToModel.value = defaultValues.value.priceMinToModel;

    // 18) К. стоим-ть (более)
    cadastralCostFromModel.value = defaultValues.value.cadastralCostFromModel;

    // 19) К. стоим-ть (менее)
    cadastralCostToModel.value = defaultValues.value.cadastralCostToModel;

    // 20) Задаток, р (более)
    depositFromModel.value = defaultValues.value.depositFromModel;

    // 21) Задаток, р (менее)
    depositToModel.value = defaultValues.value.depositToModel;

    // 22) Задаток, % (более)
    depositPercentFromModel.value = defaultValues.value.depositPercentFromModel;

    // 23) Задаток, % (менее)
    depositPercentToModel.value = defaultValues.value.depositPercentToModel;

    // 24) Категория
    categoriesModel.value = defaultValues.value.categoriesModel;

    // 25) Площадь, м2 (более)
    areaFromModel.value = defaultValues.value.areaFromModel;

    // 26) Площадь, м2 (менее)
    areaToModel.value = defaultValues.value.areaToModel;

    // 27) ВРИ
    permittedUsesModel.value = defaultValues.value.permittedUsesModel;

    // 28) Рубрика
    rubricsModel.value = defaultValues.value.rubricsModel;

    // 29) Категория НСПД
    categoriesNspdModel.value = defaultValues.value.categoriesNspdModel;

    // 30) Площадь, м2 (более) НСПД
    areaFromNspdModel.value = defaultValues.value.areaFromNspdModel;

    // 31) Площадь, м2 (менее) НСПД
    areaToNspdModel.value = defaultValues.value.areaFromNspdModel;

    // 32) ВРИ НСПД
    permittedUsesNspdModel.value = defaultValues.value.permittedUsesNspdModel;

    // 33) Рубрика НСПД
    rubricsNspdModel.value = defaultValues.value.rubricsNspdModel;

    await loadAdditionalFilters();

    isDirty.value = false;
  }

  const onSearchPermittedUses = debounce(async (event) => {
    const value = event?.target?.value || '';

    await fetchFilterData('permittedUses', 'search_permitted_use', value, 1000, 0, 'torgi_gov');
    await loadAdditionalFilters();
  }, 800);

  const onSearchPermittedUsesNspd = debounce(async (event) => {
    const value = event?.target?.value || '';

    await fetchFilterData('permittedUsesNspd', 'search_permitted_use', value, 1000, 0, 'nspd');
    await loadAdditionalFilters();
  }, 800);

  const onSearchRubrics = debounce(async (event) => {
    const value = event?.target?.value || '';

    await fetchFilterData('rubrics', 'search_rubrics', value, 100, 0, 'torgi_gov');
    await loadAdditionalFilters();
  }, 800);

  const onSearchRubricsNspd = debounce(async (event) => {
    const value = event?.target?.value || '';

    await fetchFilterData('rubricsNspd', 'search_rubrics', value, 100, 0, 'nspd');
    await loadAdditionalFilters();
  }, 800);

  const onSearchCategories = debounce(async (event) => {
    const value = event?.target?.value || '';

    await fetchFilterData('categories', 'search_categories', value, 100, 0, ['torgi_gov', 'torgi_gov_purpose']);
    await loadAdditionalFilters();
  }, 800);

  const onSearchCategoriesNspd = debounce(async (event) => {
    const value = event?.target?.value || '';

    await fetchFilterData('categories', 'search_categories', value, 100, 0, ['nspd']);
    await loadAdditionalFilters();
  }, 800);

  const updateFilters = debounce(async (event) => {
    await loadAdditionalFilters();
  }, 800);

  const fieldsData = ref([
    {
      name: 'region_ids',
      label: 'Регион',
      hideDetails: true,
      model: regionsModel,
      type: 'treeselect',
      items: filtersDataRegions,
      clearable: false,
      placeholder: 'Субъект РФ',
      multiple: true,
      onChange: updateFilters,
      size: 'half',
      tooltip: {
        text: 'Субъект местонахождения имущества',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'bidd_start_time_from',
      label: 'Начало пдч.заяв. от',
      hideDetails: true,
      clearable: true,
      model: biddStartTimeFromModel,
      onChange: updateFilters,
      type: 'date',
      placeholder: '--.--.--',
      tooltip: {
        text: 'Дата <u>начала</u> подачи заявок для участия в Процедуре. <u>Позднее чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'bidd_start_time_to',
      label: 'Начало пдч.заяв. до',
      hideDetails: true,
      clearable: true,
      model: biddStartTimeToModel,
      onChange: updateFilters,
      type: 'date',
      placeholder: '--.--.--',
      tooltip: {
        text: 'Дата <u>начала</u> подачи заявок для участия в Процедуре. <u>Ранее чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'bidd_type_ids',
      label: 'Вид торгов',
      hideDetails: true,
      model: biddTypesModel,
      type: 'autocomplete',
      items: filtersDataBiddTypes,
      onChange: updateFilters,
      placeholder: 'Выбрать значение',
      multiple: true,
      tooltip: {
        text: 'Можно выбрать один или несколько вариантов предусмотренных текущим Законодательством, например: <i>Аренда и продажа земельных участков, Публичные торги по продаже земельных участков, Аренда лесных участков и продажа лесных насаждений, Комплексное развитие территорий</i> и т.д.',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'transaction_types',
      label: 'Вид сделки',
      hideDetails: true,
      model: transactionTypesModel,
      type: 'autocomplete',
      items: transactionTypes,
      placeholder: 'Выбрать значение',
      onChange: updateFilters,
      multiple: true,
      tooltip: {
        text: 'Можно выбрать один или несколько вариантов предусмотренных текущим Законодательством, например: <i>Продажа, Аренда<i> и другие.',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'bidd_end_time_from',
      label: 'Окнч.пдч.заяв. от',
      hideDetails: true,
      clearable: true,
      model: biddEndTimeFromModel,
      onChange: updateFilters,
      type: 'date',
      placeholder: '--.--.--',
      tooltip: {
        text: 'Дата <u>окончания</u> подачи заявок для участия в Процедуре. <u>Позднее чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'bidd_end_time_to',
      label: 'Окнч.пдч.заяв. до',
      hideDetails: true,
      clearable: true,
      model: biddEndTimeToModel,
      onChange: updateFilters,
      type: 'date',
      placeholder: '--.--.--',
      tooltip: {
        text: 'Дата <u>окончания</u> подачи заявок для участия в Процедуре. <u>Ранее чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'bidd_form_ids',
      label: 'Форма проведения',
      hideDetails: true,
      model: biddFormsModel,
      type: 'autocomplete',
      items: filtersDataBiddForms,
      onChange: updateFilters,
      placeholder: 'Выбрать значение',
      multiple: true,
      tooltip: {
        text: 'Можно выбрать один или несколько вариантов предусмотренных текущим Законодательством, например: <i>Аукцион, Конкурс, Электронный аукцион, Электронный конкурс, Сообщение о представлении (реализации)</i> и т.д.',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'etp_codes_ids',
      label: 'ЭТП',
      hideDetails: true,
      model: etpCodesModel,
      type: 'autocomplete',
      items: etpCodes,
      onChange: updateFilters,
      placeholder: 'Выбрать значение',
      multiple: true,
      tooltip: {
        text: 'Электронно-торговая площадка',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'lot',
      label: 'Извещение, лот',
      hideDetails: true,
      model: lotModel,
      onInput: updateFilters,
      type: 'text',
      placeholder: 'Например, 21000004710000017906_1',
      tooltip: {
        text: 'Идентификационный номер Процедуры. Поиск осуществляется в т.ч. по неполному совпадению',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'cadaster_number',
      label: 'Кадастровый номер',
      hideDetails: true,
      model: cadasterNumberModel,
      onInput: updateFilters,
      type: 'text',
      placeholder: 'Например, 77:03:0010007:5286',
      tooltip: {
        text: 'Кадастровый номер - уникальный идентификационный номер, присваиваемый объекту недвижимости (земельному участку, зданию, сооружению, помещению) при его постановке на кадастровый учет. Служит для однозначной идентификации объекта в государственном кадастре недвижимости и используется при совершении различных операций с недвижимостью. Поиск осуществляется в т.ч. по неполному совпадению',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'tg_to_kn_area_ratio',
      label: 'Сравн. S (TG и КН)',
      hideDetails: true,
      model: tgToKnModel,
      onChange: updateFilters,
      type: 'autocomplete',
      items: tgToKn,
      placeholder: 'Выбрать значение',
      multiple: true,
      tooltip: {
        text: 'Сравнение площади земельного участка полученных из <u>документации</u> <u>Процедуры</u> и <u>Кадастрового номера</u>. Если они не отличаются более чем на 5%, то значение фильтра "<i>норма</i>". Если отличия более 5%, то следует быть аккуратным с Процедурой - могут быть нюансы',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'compositions',
      label: 'Составность',
      hideDetails: true,
      model: compositionsModel,
      onChange: updateFilters,
      type: 'autocomplete',
      items: compositions,
      placeholder: 'Выбрать значение',
      multiple: true,
      tooltip: {
        text: 'Кадастровое деление земельного участка как правило представлено в формате AA:BB:CCCCCCC:DDDD, состоит из четырех частей и состоит из: <i>Кадастрового округа, Кадастрового района, Кадастрового квартала, Кадастрового номера земельного участка.</i> В случае если в Процедуре не указан (или указан не верно) кадастровый номер земельного участка, а значит определение его местоположения на карте не возможно, будут отображаться "<i>Координаты не определены</i>"',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'price_min_cadastral_cost_ratio_percent_from',
      label: '% НЦ /КС (более)',
      hideDetails: true,
      model: priceRatioFromModel,
      onInput: updateFilters,
      type: 'number',
      placeholder: 'Например, 50',
      precision: 0,
      tooltip: {
        text: 'Отношение <i>Начальной цены</i> Процедуры к <i>Кадастровой стоимости</i> в процентах. <u>Более чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'price_min_cadastral_cost_ratio_percent_to',
      label: '% НЦ /КС (менее)',
      hideDetails: true,
      model: priceRatioToModel,
      onInput: updateFilters,
      type: 'number',
      placeholder: 'Например, 77',
      precision: 0,
      tooltip: {
        text: 'Отношение <i>Начальной цены</i> Процедуры к <i>Кадастровой стоимости</i> в процентах. <u>Менее чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'price_min_from',
      label: 'Нач. цена, р (более)',
      hideDetails: true,
      model: priceMinFromModel,
      onInput: updateFilters,
      type: 'number',
      placeholder: 'Например, 1234',
      tooltip: {
        text: 'Начальная цена Процедуры. <u>Более чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'price_min_to',
      label: 'Нач. цена, р (менее)',
      hideDetails: true,
      model: priceMinToModel,
      onInput: updateFilters,
      type: 'number',
      placeholder: 'Например, 12345',
      tooltip: {
        text: 'Начальная цена Процедуры. <u>Менее чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'cadastral_cost_from',
      label: 'К. стоим-ть (более)',
      hideDetails: true,
      model: cadastralCostFromModel,
      onInput: updateFilters,
      type: 'number',
      placeholder: 'Например, 10 000',
      tooltip: {
        text: '<i>Кадастровая стоимость</i> - результат выполненной в соответствии с законодательством оценки стоимости объекта недвижимости на определённую дату, зафиксированный в Едином государственном реестре недвижимости (ЕГРН) и используемый, в частности, для целей налогообложения. <u>Более чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'cadastral_cost_to',
      label: 'К. стоим-ть (менее)',
      hideDetails: true,
      model: cadastralCostToModel,
      onInput: updateFilters,
      type: 'number',
      placeholder: 'Например, 100 000',
      tooltip: {
        text: '<i>Кадастровая стоимость</i> - результат выполненной в соответствии с законодательством оценки стоимости объекта недвижимости на определённую дату, зафиксированный в Едином государственном реестре недвижимости (ЕГРН) и используемый, в частности, для целей налогообложения. <u>Менее чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'deposit_from',
      label: 'Задаток, р (более)',
      hideDetails: true,
      model: depositFromModel,
      onInput: updateFilters,
      type: 'number',
      placeholder: 'Например, 123',
      tooltip: {
        text: '<i>Задаток</i> - денежная сумма, которую участник торгов вносит для подтверждения своих намерений заключить договор купли-продажи (или аренды) в случае победы, а также для обеспечения исполнения этого договора. Это своего рода гарантия того, что победитель торгов действительно намерен приобрести имущество и не откажется от сделки. <u>Более чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'deposit_to',
      label: 'Задаток, р (менее)',
      hideDetails: true,
      model: depositToModel,
      onInput: updateFilters,
      type: 'number',
      placeholder: 'Например, 1234',
      tooltip: {
        text: '<i>Задаток</i> - денежная сумма, которую участник торгов вносит для подтверждения своих намерений заключить договор купли-продажи (или аренды) в случае победы, а также для обеспечения исполнения этого договора. Это своего рода гарантия того, что победитель торгов действительно намерен приобрести имущество и не откажется от сделки. <u>Менее чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'deposit_percent_from',
      label: 'Задаток, % (более)',
      hideDetails: true,
      model: depositPercentFromModel,
      onInput: updateFilters,
      type: 'number',
      placeholder: 'Например, 1',
      precision: 0,
      tooltip: {
        text: 'Отношение <i>Задатка</i> к <i>Начальной цене</i> Процедуры в процентах. <u>Более чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'deposit_percent_to',
      label: 'Задаток, % (менее)',
      hideDetails: true,
      model: depositPercentToModel,
      onInput: updateFilters,
      type: 'number',
      placeholder: 'Например, 50',
      precision: 0,
      tooltip: {
        text: 'Отношение <i>Задатка</i> к <i>Начальной цене</i> Процедуры в процентах. <u>Менее чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      split: 'Характеристики земельного участка (согласно torgi.gov) [TG]',
    },
    {
      name: 'categories_ids',
      label: 'Категория',
      hideDetails: true,
      hideNoData: true,
      model: categoriesModel,
      onChange: updateFilters,
      type: 'autocomplete',
      items: filtersDataCategories,
      placeholder: 'Выбрать значение',
      multiple: true,
      size: 'half-lg',
      // loading: categoriesPending,
      onInput: onSearchCategories,
      tooltip: {
        text: '<i>Категория земельного участка</i> - это характеристика, определяющая целевое назначение земли и правовой режим ее использования. Категория устанавливается для каждого участка и указывает, как его можно использовать в соответствии с Законодательством. <u>Сведения согласно документации Процедуры torgi.gov<u/>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'area_from',
      label: 'Площадь от',
      hideDetails: true,
      model: areaFromModel,
      onInput: updateFilters,
      type: 'number',
      placeholder: 'Например, 1234',
      tooltip: {
        text: 'Площадь земельного участка. <u>Сведения согласно документации Процедуры torgi.gov.</u> <u>Более чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'area_to',
      label: 'Площадь до',
      hideDetails: true,
      model: areaToModel,
      onInput: updateFilters,
      type: 'number',
      placeholder: 'Например, 12345',
      tooltip: {
        text: 'Площадь земельного участка. <u>Сведения согласно документации Процедуры torgi.gov</u>. <u>Менее чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      size: 'fill',
      name: 'permitted_uses_id',
      label: 'ВРИ',
      hideDetails: true,
      hideNoData: true,
      model: permittedUsesModel,
      onChange: updateFilters,
      type: 'autocomplete',
      items: filtersDataPermittedUses,
      placeholder: 'Выбрать значение',
      multiple: true,
      returnObject: false,
      loading: permittedUsesPending,
      onInput: onSearchPermittedUses,
      tooltip: {
        text: '<i>Вид разрешённого использования земельного участка (ВРИ)</i> - это установленный законом перечень видов деятельности, которые могут осуществляться на конкретном земельном участке. Он определяет, для каких целей можно использовать землю, например, для жилищного строительства, ведения сельского хозяйства, размещения промышленных объектов и т.д. Поиск осуществляется в т.ч. по неполному совпадению. <u>Сведения согласно документации Процедуры torgi.gov</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      size: 'fill',
      name: 'rubric_ids',
      label: 'Рубрика',
      hideDetails: true,
      hideNoData: true,
      model: rubricsModel,
      onChange: updateFilters,
      type: 'treeselect',
      items: filtersDataRubrics,
      placeholder: 'Выбрать значение',
      multiple: true,
      tooltip: {
        text: 'Классификатор повышающий удобство использования. Позволяет обойти многочисленные варианты написания ВРИ и ошибок в них. Приводит всё к небольшому но функциональному перечню вариантов использованию земельного участка - для жилья, предпринимательства и т.д. Сведения согласно анализу <i>ВРИ</i> из <u>документации Процедуры torgi.gov</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      split: 'Характеристики земельного участка (по кадастровому номеру) [КН]',
    },
    {
      size: 'half-lg',
      name: 'categories_nspd_ids',
      label: 'Категория [КН]',
      hideDetails: true,
      hideNoData: true,
      model: categoriesNspdModel,
      onChange: updateFilters,
      type: 'autocomplete',
      items: filtersDataCategoriesNspd,
      placeholder: 'Выбрать значение',
      multiple: true,
      onInput: onSearchCategoriesNspd,
      tooltip: {
        text: '<i>Категория земельного участка</i> - это характеристика, определяющая целевое назначение земли и правовой режим ее использования. Категория устанавливается для каждого участка и указывает, как его можно использовать в соответствии с Законодательством. <u>Сведения согласно Кадастровому номеру</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'area_from_nspd_from',
      label: 'Площадь от [КН]',
      hideDetails: true,
      model: areaFromNspdModel,
      onInput: updateFilters,
      type: 'number',
      placeholder: 'Например, 1234',
      tooltip: {
        text: 'Площадь земельного участка. <u>Сведения согласно Кадастровому номеру</u>. <u>Более чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      name: 'area_from_nspd_to',
      label: 'Площадь до [КН]',
      hideDetails: true,
      model: areaToNspdModel,
      onInput: updateFilters,
      type: 'number',
      placeholder: 'Например, 12345',
      tooltip: {
        text: 'Площадь земельного участка. <u>Сведения согласно Кадастровому номеру</u>. <u>Менее чем</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      size: 'fill',
      name: 'permitted_uses_nspd_id',
      label: 'ВРИ [КН]',
      hideDetails: true,
      hideNoData: true,
      model: permittedUsesNspdModel,
      onChange: updateFilters,
      type: 'autocomplete',
      items: filtersDataPermittedUsesNspd,
      placeholder: 'Выбрать значение',
      multiple: true,
      returnObject: false,
      loading: permittedUsesNspdPending,
      onInput: onSearchPermittedUsesNspd,
      tooltip: {
        text: '<i>Вид разрешённого использования земельного участка (ВРИ)</i> - это установленный законом перечень видов деятельности, которые могут осуществляться на конкретном земельном участке. Он определяет, для каких целей можно использовать землю, например, для жилищного строительства, ведения сельского хозяйства, размещения промышленных объектов и т.д. Поиск осуществляется в т.ч. по неполному совпадению. <u>Сведения согласно Кадастровому номеру</u>',
        icon: '20/info',
        interactive: true,
      },
    },
    {
      size: 'fill',
      name: 'rubric_nspd_ids',
      label: 'Рубрика [КН]',
      hideDetails: true,
      hideNoData: true,
      model: rubricsNspdModel,
      onChange: updateFilters,
      type: 'treeselect',
      items: filtersDataRubricsNspd,
      placeholder: 'Выбрать значение',
      multiple: true,
      tooltip: {
        text: '<i>Классификатор повышающий удобство использования. Позволяет обойти многочисленные варианты написания ВРИ</i> и ошибок в них. Приводит всё к небольшому но функциональному перечню вариантов использованию земельного участка - для жилья, предпринимательства и т.д. Сведения согласно анализу ВРИ из <u>Кадастрового номера</u>',
        icon: '20/info',
        interactive: true,
      },
    },
  ]);

  async function loadAdditionalFilters() {
    await Promise.all([
      fetchFilterData('permittedUses', 'search_permitted_use', '', 1000, 0, 'torgi_gov'),
      fetchFilterData('permittedUsesNspd', 'search_permitted_use', '', 1000, 0, 'nspd'),
      fetchFilterData('rubrics', 'search_rubrics', '', 100, 0, 'torgi_gov'),
      fetchFilterData('rubricsNspd', 'search_rubrics', '', 100, 0, 'nspd'),
      fetchFilterData('categories', 'search_categories', '', 100, 0, ['torgi_gov', 'torgi_gov_purpose']),
      fetchFilterData('categoriesNspd', 'search_categories', '', 100, 0, ['nspd']),
      fetchFilterData('regions', 'search_regions', '', 100, 0),
      fetchFilterData('biddForms', 'search_bidd_forms', '', 100, 0),
      fetchFilterData('biddTypes', 'search_bidd_types', '', 100, 0),
      fetchFilterData('compositions', 'search_compositions', '', 100, 0),
      fetchFilterData('transactionTypes', 'search_transaction_types', '', 100, 0),
    ]);
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

      etpCodes.value = (data?.payload?.etp_codes || []).map((item) => {
        return {
          text: item.etp_code,
          value: item.id,
        };
      });

      await loadAdditionalFilters();
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
        const defaultValue = item.default;

        if (name && !isAvailable) {
          const field = fieldsData.value.find((item) => item.name === name);

          if (field) {
            field.disabled = true;
          }
        }

        if (name && defaultValue) {
          if (name === 'bidd_end_time_from') {
            biddEndTimeFromModel.value = defaultValue;
            defaultValues.value.biddEndTimeFromModel = defaultValue;
          }
          if (name === 'bidd_end_time_to') {
            biddEndTimeToModel.value = defaultValue;
            defaultValues.value.biddEndTimeToModel = defaultValue;
          }
          if (name === 'bidd_start_time_from') {
            biddStartTimeFromModel.value = defaultValue;
          }
          if (name === 'bidd_start_time_to') {
            biddStartTimeToModel.value = defaultValue;
          }
          if (name === 'price_min_cadastral_cost_ratio_percent_from') {
            priceRatioFromModel.value = defaultValue;
          }
          if (name === 'price_min_cadastral_cost_ratio_percent_to') {
            priceRatioToModel.value = defaultValue;
          }
          if (name === 'deposit_from') {
            depositFromModel.value = defaultValue;
          }
          if (name === 'deposit_to') {
            depositToModel.value = defaultValue;
          }
          if (name === 'rubric_ids') {
            rubricsModel.value = defaultValue;
          }
          if (name === 'rubric_nspd_ids') {
            rubricsNspdModel.value = defaultValue;
          }
          if (name === 'transaction_type_ids') {
            transactionTypesModel.value = defaultValue;
            defaultValues.value.transactionTypesModel = defaultValue;
          }
          if (name === 'compositions') {
            compositionsModel.value = defaultValue;
          }
          if (name === 'bidd_form_ids') {
            biddFormsModel.value = defaultValue;
            defaultValues.value.biddFormsModel = defaultValue;
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

  function formatDate(model) {
    if (!model?.value) return null;

    const date = new Date(model.value);

    return isNaN(date) ? null : date.toISOString().slice(0, 10);
  }

  function getFormattedFilters() {
    return {
      // 1) Регион
      region_ids: regionsModel.value || null,

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
      permitted_uses_id: permittedUsesModel.value || [],

      // 28) Рубрика
      rubric_ids: rubricsModel.value || [],

      // 29) Категория НСПД
      categories_nspd_ids: categoriesNspdModel.value || [],

      // 30) Площадь, м2 (более) НСПД
      area_from_nspd_from: areaFromNspdModel.value || null,

      // 31) Площадь, м2 (менее) НСПД
      area_from_nspd_to: areaToNspdModel.value || null,

      // 32) ВРИ НСПД
      permitted_uses_nspd_id: permittedUsesNspdModel.value || [],

      // 33) Рубрика НСПД
      rubric_nspd_ids: rubricsNspdModel.value || [],
    };
  }

  function normalizeFilterData(name, data) {
    if (name === 'permittedUses') {
      filtersDataPermittedUses.value = (data.payload || []).map((item) => ({
        text: item.permitted_use,
        value: item.id,
      }));
    }

    if (name === 'permittedUsesNspd') {
      filtersDataPermittedUsesNspd.value = (data.payload || []).map((item) => ({
        text: item.permitted_use,
        value: item.id,
      }));
    }

    if (name === 'rubrics') {
      filtersDataRubrics.value = Object.values(
        (data?.payload || []).reduce((acc, { id, rubric, rubric_partition }) => {
          const rubricId = rubric_partition.id;
          const rubricName = rubric_partition.name;

          if (!acc[rubricId]) {
            acc[rubricId] = {
              name: rubricName,
              id: rubricId,
              items: [],
            };
          }

          acc[rubricId].items.push({
            text: rubric,
            value: id,
          });

          return acc;
        }, {})
      );
    }

    if (name === 'rubricsNspd') {
      filtersDataRubricsNspd.value = Object.values(
        (data?.payload || []).reduce((acc, { id, rubric, rubric_partition }) => {
          const rubricId = rubric_partition.id;
          const rubricName = rubric_partition.name;

          if (!acc[rubricId]) {
            acc[rubricId] = {
              name: rubricName,
              id: rubricId,
              items: [],
            };
          }

          acc[rubricId].items.push({
            text: rubric,
            value: id,
          });

          return acc;
        }, {})
      );
    }

    if (name === 'categories') {
      filtersDataCategories.value = (data.payload || []).map((item) => ({
        text: item.category,
        value: item.id,
      }));
    }

    if (name === 'categoriesNspd') {
      filtersDataCategoriesNspd.value = (data.payload || []).map((item) => ({
        text: item.category,
        value: item.id,
      }));
    }

    if (name === 'regions') {
      filtersDataRegions.value = Object.values(
        (data?.payload || []).reduce((acc, { id, region, federal_district_id, federal_district }) => {
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
    }

    if (name === 'biddForms') {
      filtersDataBiddForms.value = (data.payload || []).map((item) => ({
        text: item.bidd_form,
        value: item.id,
      }));
    }

    if (name === 'biddTypes') {
      filtersDataBiddTypes.value = (data.payload || []).map((item) => ({
        text: item.bidd_type,
        value: item.id,
      }));
    }

    if (name === 'compositions') {
      compositions.value = (data.payload || []).map((item) => ({
        text: item.composition,
        value: item.id,
      }));
    }

    if (name === 'transactionTypes') {
      transactionTypes.value = (data.payload || []).map((item) => ({
        text: item.type_transaction_rus,
        value: item.id,
      }));
    }
  }

  async function fetchFilterData(name, url, query = '', limit = 10, offset = 0, sources = []) {
    const auth = useAuthStore();
    let result = [];

    if (!auth.token) {
      console.warn(`Нет токена для запроса ${name}`);

      return result;
    }

    try {
      const urlData = `${baseUrl}/client/filters/${url}`;
      const filtersData = getFormattedFilters();

      const params = new URLSearchParams({
        query,
        limit,
        offset,
      });

      if (Array.isArray(sources)) {
        sources.forEach((s) => params.append('sources', s));
      } else {
        params.append('source', sources);
      }

      const res = await fetch(`${urlData}?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${auth.token}`,
        },
        body: JSON.stringify(filtersData),
      });

      if (!res.ok) {
        throw new Error(`Ошибка поиска ${name}: ${res.statusText}`);
      }

      const data = await res.json();
      if (!data.payload) return result;

      normalizeFilterData(name, data);
    } catch (err) {
      console.error(`Ошибка при поиске ${name}`, err);
    } finally {
      // biddTypesPeinding.value = false;
      // biddFormsPending.value = false;
      // categoriesPending.value = false;
      // permittedUsesPending.value = false;
      // rubricsPending.value = false;
      // categoriesNspdPending.value = false;
      // permittedUsesNspdPending.value = false;
      // rubricsNspdPending.value = false;
    }
  }

  return {
    loadFilters,
    baseFilters,
    fieldsData,
    getFormattedFilters,
    resetFilters,
    isDirty,
    defaultValues,
    filtersReadyLoading,
  };
});
