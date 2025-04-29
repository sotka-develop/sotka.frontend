<template>
  <main class="main">
    <div class="container">
      <div class="section">
        <div class="section__title">
          <h2>Лоты</h2>
        </div>

        <div class="form-filters">
          <div class="form-filters__items form-filters__items--4">
            <!-- Окончательная подача заявок от -->
            <div class="form-filters__item">
              <Field
                type="date"
                label="Окончательная подача заявок от"
                hide-details
                v-model="biddEndTimeFromModel"
                placeholder="Выбрать значение"
              />
            </div>

            <!-- Окончательная подача заявок до -->
            <div class="form-filters__item">
              <Field
                type="date"
                label="Окончательная подача заявок до"
                hide-details
                v-model="biddEndTimeToModel"
                placeholder="Выбрать значение"
              />
            </div>

            <!-- Процедура / Форма торгов -->

            <div class="form-filters__item">
              <Field
                type="select"
                label="Процедура"
                placeholder="Выбрать значение"
                v-model="biddModel"
                :items="biddData"
                multiple
                hide-details
                item-title="text"
                item-value="value"
              />
            </div>

            <!-- Локация / Регион -->
            <div class="form-filters__item">
              <Field
                type="select"
                label="Локация"
                placeholder="Регион, область, город"
                v-model="regionsModel"
                multiple
                hide-details
                item-title="text"
                item-value="value"
                :items="regionsData"
              />
            </div>

            <!-- Электронная площадка / Код ЭТП -->
            <div class="form-filters__item">
              <Field
                type="select"
                label="Электронная площадка"
                placeholder="Выбрать значение"
                item-title="text"
                item-value="value"
                v-model="codesModel"
                :items="codesData"
                multiple
                hide-details
              />
            </div>

            <!-- Кадастровый номер -->
            <div class="form-filters__item">
              <Field
                type="number"
                v-model="cadasterNumberModel"
                label="Кадастровый номер"
                control-variant="hidden"
                placeholder="Например, 1111"
                hide-details
              />
            </div>

            <!-- Извещение, лот -->
            <div class="form-filters__item">
              <Field type="text" label="Извещение, лот" v-model="lotModel" placeholder="Например, 1111" hide-details />
            </div>

            <!-- Составность / Композиция -->
            <div class="form-filters__item">
              <Field
                type="select"
                label="Составность"
                placeholder="Выбрать значение"
                v-model="compositionModel"
                :items="compositionData"
                multiple
                hide-details
              />
            </div>

            <!-- Добавлено / Дата добавления -->
            <div class="form-filters__item">
              <Field type="date" label="Добавлено" v-model="addedAtModel" placeholder="Выбрать значение" hide-details />
            </div>

            <!-- Рубрики -->
            <div class="form-filters__item">
              <Field
                type="select"
                label="Рубрики"
                placeholder="Выбрать значение"
                item-title="text"
                item-value="value"
                multiple
                v-model="rubricsModel"
                :items="rubricsData"
                hide-details
              />
            </div>

            <!-- Категория ЗУ -->
            <div class="form-filters__item">
              <Field
                type="select"
                label="Категория ЗУ"
                placeholder="Выбрать значение"
                v-model="categoryModel"
                item-title="text"
                item-value="value"
                multiple
                :items="categoryData"
                hide-details
              />
            </div>
          </div>

          <div class="form-filters__items form-filters__items--1">
            <!-- ВРИ / Разрешенные использования -->
            <div class="form-filters__item">
              <Field
                type="autocomplete"
                v-model="usesModel"
                :items="usesData"
                label="ВРИ"
                placeholder="Выбрать значение"
                multiple
                item-title="text"
                item-value="value"
                :return-object="false"
                :onInput="onSearchPermittedUses"
                hide-details
              />
            </div>
          </div>

          <div class="form-filters__items form-filters__items--4">
            <!-- Начальная цена, ₽ (более) / Минимальная цена от -->
            <div class="form-filters__item">
              <Field
                type="number"
                v-model="priceMinFromModel"
                label="Начальная цена, ₽ (более)"
                placeholder="Например, 1111"
                hide-details
              />
            </div>

            <!-- Начальная цена, ₽ (менее) / Минимальная цена до -->
            <div class="form-filters__item">
              <Field
                type="number"
                v-model="priceMaxFromModel"
                label="Начальная цена, ₽ (менее)"
                placeholder="Например, 1111"
                hide-details
              />
            </div>

            <!-- Кадастровая стоимость от -->
            <div class="form-filters__item">
              <Field
                type="number"
                v-model="cadastralCostFromModel"
                label="Кадастровая стоимость от"
                placeholder="Например, 1111"
                hide-details
              />
            </div>

            <!-- Кадастровая стоимость до -->
            <div class="form-filters__item">
              <Field
                type="number"
                v-model="cadastralCostToModel"
                label="Кадастровая стоимость до"
                placeholder="Например, 1111"
                hide-details
              />
            </div>

            <!-- % соотн. нач.ц. и кад.ст от -->
            <div class="form-filters__item">
              <Field
                type="number"
                v-model="priceMinCadastralCostRatioPercentFromModel"
                label="% соотн. нач.ц. и кад.ст от"
                placeholder="Например, 1111"
                hide-details
              />
            </div>

            <!-- % соотн. нач.ц. и кад.ст до -->
            <div class="form-filters__item">
              <Field
                type="number"
                v-model="priceMinCadastralCostRatioPercentToModel"
                label="% соотн. нач.ц. и кад.ст до"
                placeholder="Например, 1111"
                hide-details
              />
            </div>

            <!-- Площадь от -->
            <div class="form-filters__item">
              <Field type="number" v-model="areaFromModel" label="Площадь от" placeholder="Например, 1111" hide-details />
            </div>

            <!-- Площадь до -->
            <div class="form-filters__item">
              <Field type="number" v-model="areaToModel" label="Площадь до" placeholder="Например, 1111" hide-details />
            </div>
          </div>
        </div>

        <div class="section__actions">
          <Button text="Применить" @click="onSearch" />
        </div>
      </div>

      <div class="section">
        <div class="section__title">
          <h2>Карта</h2>
        </div>

        <Map
          :dots="dots"
          :onCoordsUpdate="onCoordsUpdate"
          :onClusterClick="onClusterClick"
          :onPointClick="onPointClick"
          :loading="mapPending"
        />
      </div>

      <div class="section">
        <div class="section__title">
          <h2>Таблицы</h2>
        </div>

        <v-data-table-server
          v-model:page="page"
          v-model:items-per-page="pageSize"
          v-model:items="tableItems"
          :items-length="totalCount"
          :headers="tableHeaders"
          :loading="lotsPending"
          loading-text="Загрузка"
          no-results-text="Ничего не найдено"
          no-data-text="Данных нет"
          @update:options="onOptionsUpdate"
        >
          <template #item.link="{ item }">
            <a :href="item.link" target="_blank">{{ item.link }}</a>
          </template>
        </v-data-table-server>
      </div>
    </div>
  </main>
</template>

<script setup>
  import { computed, onMounted, onUpdated, ref, shallowRef } from 'vue';

  import Field from '@/components/fields/field/Field.vue';
  import Button from '@/components/button/Button.vue';
  import Map from '@/components/map/Map.vue';

  import { storeToRefs } from 'pinia';
  import { useFiltersStore } from '@/stores/filters';
  import { useLotsStore } from '@/stores/lots';

  import debounce from 'lodash.debounce';

  // store
  const filtersStore = useFiltersStore();
  const lotsStore = useLotsStore();

  const { mapPending, lotsPending } = storeToRefs(lotsStore);

  import useSearchFilters from '@/composables/useSearchFilters';

  //#region данные таблицы
  const page = ref(1);
  const pageSize = ref(10);
  const totalCount = ref(0);

  const data = ref([]);
  const tableItems = ref([]);

  const tableHeaders = [
    { title: 'Ссылка', key: 'link' },
    { title: 'Кадастровый номер', key: 'cadaster_number' },
    { title: 'Площадь', key: 'area' },
    { title: 'Площадь (по НСПД)', key: 'area_from_nspd' },
    { title: 'Минимальная цена', key: 'price_min' },
    { title: 'Кадастровая стоимость (по НСПД)', key: 'cadastral_cost_from_nspd' },
    { title: '% соотношение начальной цены и кадастровой стоимости', key: 'price_min_cadastral_cost_ratio_percent' },
    { title: 'Код ЭТП', key: 'etp_code' },
    { title: 'Категория', key: 'category' },
    { title: 'Категория (по НСПД)', key: 'category_from_nspd' },
    { title: 'Разрешенное использование', key: 'permitted_use' },
    { title: 'Разрешенное использование (по документу НСПД)', key: 'permitted_use_from_nspd' },
    { title: 'Регион', key: 'region' },
    { title: 'Федеральный округ', key: 'federal_district' },
    { title: 'Композиция', key: 'composition' },
  ];

  function transformLotsToTable(lots) {
    return lots.map((lot) => ({
      link: lot.link || '',
      cadaster_number: lot.cadaster_number || '',
      area: lot.area || '',
      area_from_nspd: lot.area_from_nspd || '',
      price_min: lot.price_min || '',
      cadastral_cost_from_nspd: lot.cadastral_cost_from_nspd || '',
      price_min_cadastral_cost_ratio_percent: lot.price_min_cadastral_cost_ratio_percent || '',
      etp_code: lot.etp_code?.entity_name || '',
      category: lot.category || '',
      category_from_nspd: lot.category_from_nspd || '',
      permitted_use: lot.permitted_use || '',
      permitted_use_from_nspd: lot.permitted_use_established_by_document_from_nspd || '',
      region: lot.region?.region || '',
      federal_district: lot.federal_district?.federal_district || '',
      composition: lot.composition || '',
    }));
  }
  //#endregion

  //#region данные карты
  const mapZoom = ref(3);
  const mapDotsToCluster = ref(64);

  // клик по кластеру
  const onClusterClick = (data) => {};

  // клик по точке
  const onPointClick = (data) => {};

  // клик по маркеру
  const onMarkerClick = (marker) => {
    // console.log(marker);
  };

  // обновление карты
  const onCoordsUpdate = debounce(async (event) => {
    mapZoom.value = Math.floor(event?.location?.zoom || mapDefaultZoom.value);

    const bounds = event?.location?.bounds;
    const search_filters = { ...filters.value, page: null, page_size: null };

    if (bounds && Array.isArray(bounds)) {
      const coords = {
        lon_lu: bounds[0][0],
        lat_rd: bounds[0][1],
        lon_rd: bounds[1][0],
        lat_lu: bounds[1][1],
      };

      const mapPayload = {
        ...coords,
        search_filters,
        zoom: mapZoom.value,
        dots_to_cluster: mapDotsToCluster.value,
        land_ids: null, // все точки, входящие в границы карты
      };

      await fetchMapData(mapPayload);
    }
  }, 1000);

  // отображаемые точки на карте
  const dots = ref([]);

  // true - отображаются все точки на карте
  // const showAllDots = ref(true);

  // список id сущностей таблицы
  const landIdsFromTable = ref([]);

  // координаты по умолчанию - РФ целиком
  const defaultCoords = {
    lat_lu: 14,
    lon_lu: -11,
    lat_rd: 82,
    lon_rd: 180,
  };

  //#endregion

  //#region данные для фильтров

  // Окончательная подача заявок от
  const biddEndTimeFromModel = ref(null);
  const biddEndTimeFromModelFormatted = computed(() => {
    if (!biddEndTimeFromModel.value) return null;

    return new Date(biddEndTimeFromModel.value).toISOString().slice(0, 10);
  });

  // Окончательная подача заявок до
  const biddEndTimeToModel = ref(null);
  const biddEndTimeToModelFormatted = computed(() => {
    if (!biddEndTimeToModel.value) return null;

    return new Date(biddEndTimeToModel.value).toISOString().slice(0, 10);
  });

  // Форма торгов
  const biddModel = ref(null);
  const biddData = computed(() => {
    return filtersStore.bidd_forms;
  });

  // Локация / Регион
  const regionsModel = ref(null);
  const regionsData = computed(() => {
    return filtersStore.regions;
  });

  // Электронная площадка / Код ЭТП
  const codesModel = ref(null);
  const codesData = computed(() => {
    return filtersStore.etp_codes;
  });

  // Кадастровый номер
  const cadasterNumberModel = ref(null);

  // Лот
  const lotModel = ref(null);

  // Композиция
  const compositionModel = ref(null);
  const compositionData = ref(['Кад. номер', 'Кад. квартал', 'Кад. район', 'Коорд. не определены']);

  // Дата добавления
  const addedAtModel = ref(null);
  const addedAtModelFormatted = computed(() => {
    if (!addedAtModel.value) return null;

    return new Date(addedAtModel.value).toISOString().slice(0, 10);
  });

  // Рубрики
  const rubricsModel = ref(null);
  const rubricsData = computed(() => {
    return filtersStore.rubrics;
  });

  // Категория ЗУ
  const categoryModel = ref(null);
  const categoryData = computed(() => {
    return filtersStore.categories;
  });

  // ВРИ / Разрешенные использования
  const usesModel = ref(null);
  const usesData = ref([]);

  // Начальная цена, ₽ (более) / Минимальная цена от
  const priceMinFromModel = ref(null);

  // Начальная цена, ₽ (менее) / Минимальная цена до
  const priceMaxFromModel = ref(null);

  // Кадастровая стоимость от
  const cadastralCostFromModel = ref(null);

  // Кадастровая стоимость до
  const cadastralCostToModel = ref(null);

  //  % соотн. нач.ц. и кад.ст от
  const priceMinCadastralCostRatioPercentFromModel = ref(null);

  //  % соотн. нач.ц. и кад.ст до
  const priceMinCadastralCostRatioPercentToModel = ref(null);

  // Площадь от
  const areaFromModel = ref(null);
  // Площадь до
  const areaToModel = ref(null);

  const models = {
    biddEndTimeFromModel,
    biddEndTimeToModel,
    biddModel,
    regionsModel,
    codesModel,
    cadasterNumberModel,
    lotModel,
    compositionModel,
    addedAtModel,
    rubricsModel,
    categoryModel,
    usesModel,
    priceMinFromModel,
    priceMaxFromModel,
    cadastralCostFromModel,
    cadastralCostToModel,
    priceMinCadastralCostRatioPercentFromModel,
    priceMinCadastralCostRatioPercentToModel,
    areaFromModel,
    areaToModel,
    page,
    pageSize,
  };

  const filters = useSearchFilters(models);

  //#endregion

  // поиск по ВРИ
  const onSearchPermittedUses = debounce(async (data) => {
    const value = data?.target?.value || '';

    const result = await filtersStore.searchPermittedUses(value, 50, 0);
    usesData.value = result.value;
  }, 800);

  // получение данных для карты
  async function fetchMapData(payload) {
    const mapResult = await lotsStore.fetchMapData(payload);

    if (!mapResult) {
      console.error('Ошибка при получении лотов для карты!');
      return;
    }

    dots.value = mapResult.dots || [];
  }

  // фильтрация
  async function onSearch() {
    const result = await lotsStore.fetchLots(filters.value);

    if (!result) {
      console.error('Ошибка при получении лотов!');

      return;
    }

    data.value = result?.land_areas || [];
    totalCount.value = result?.total_count || 0;
    tableItems.value = transformLotsToTable(data.value);

    // const coords = showAllDots.value ? defaultCoords : result?.coords_rect || defaultCoords;
    // const zoom = showAllDots.value ? mapDefaultZoom.value : mapZoom.value;
    // const dotsToCluster = mapDotsToCluster.value;

    const coords = defaultCoords;
    const zoom = mapZoom.value;
    const dotsToCluster = mapDotsToCluster.value;

    const search_filters = { ...filters.value, page: null, page_size: null };

    // извлечение id
    landIdsFromTable.value = data.value.map((lot) => lot.id).filter(Boolean);

    // if (showAllDots.value) {
    //   search_filters.page = null;
    //   search_filters.page_size = null;
    // }

    // const land_ids = showAllDots ? null : [...landIdsFromTable];
    const land_ids = null;

    const mapPayload = {
      ...coords,
      zoom,
      dots_to_cluster: dotsToCluster,
      search_filters,
      land_ids,
    };

    await fetchMapData(mapPayload);
  }

  const isFirstOptionsUpdate = ref(true);

  // контролы таблицы
  function onOptionsUpdate(options) {
    if (isFirstOptionsUpdate.value) {
      isFirstOptionsUpdate.value = false;

      return;
    }

    page.value = options.page;
    pageSize.value = options.itemsPerPage;

    onSearch();
  }

  // получение данных точки
  async function getPointData() {}

  onMounted(async () => {
    // получаем данные фильтров
    await filtersStore.loadFilters();

    onSearch();
  });
</script>

<style lang="scss" scoped>
  // TODO временно
  .main {
    padding: 36px 0 36px;
  }

  .form-filters {
    &__items {
      display: grid;
      gap: 24px 28px;

      &--1 {
        grid-template-columns: 1fr;
      }

      &--3 {
        grid-template-columns: 1fr 1fr 2fr;
      }

      &--4 {
        grid-template-columns: 1fr 1fr 1fr 1fr;
      }

      &:not(:last-child) {
        margin-bottom: 28px;
      }
    }
  }

  .section {
    background-color: $color-white;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0px 0px 12px 0px #76a3c01f;

    &:not(:last-child) {
      margin-bottom: 24px;
    }

    &__title {
      margin-bottom: 28px;
    }

    &__actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      border-top: 1px solid $color-border-base-1-400;
      padding-top: 24px;
      margin-top: 44px;
    }
  }
</style>
