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

        <div class="map">
          <yandex-map v-model="map" :settings="mapSettins" width="100%" height="100%">
            <yandex-map-default-scheme-layer />
            <yandex-map-default-features-layer />

            <yandex-map-marker v-for="(marker, index) in markers" :key="index" :settings="marker">
              <div class="marker"></div>
            </yandex-map-marker>
          </yandex-map>
        </div>
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
          :loading="isLoading"
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
  import { computed, onMounted, ref, shallowRef } from 'vue';

  import Field from '@/components/fields/field/Field.vue';
  import Button from '@/components/button/Button.vue';

  import { storeToRefs } from 'pinia';
  import { useFiltersStore } from '@/stores/filters';
  import { useLotsStore } from '@/stores/lots';

  import debounce from 'lodash.debounce';

  // store
  const filtersStore = useFiltersStore();
  const lotsStore = useLotsStore();

  const { isLoading } = storeToRefs(lotsStore);

  import useSearchFilters from '@/composables/useSearchFilters';

  import {
    YandexMap,
    YandexMapClusterer,
    YandexMapControl,
    YandexMapControlButton,
    YandexMapControls,
    YandexMapListener,
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultSchemeLayer,
    YandexMapMarker,
    YandexMapZoomControl,
  } from 'vue-yandex-maps';

  // список id сущностей таблицы
  const landIdsFromTable = ref([]);

  const lotsForMap = ref([]);

  const mapBounds = ref({
    lat_lu: 0,
    lon_lu: 0,
    lat_rd: 0,
    lon_rd: 0,
  });

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
  const map = shallowRef(null);
  const mapZoom = ref(4);
  const enabledBehaviors = ref(['drag', 'pinchZoom', 'dblClick']);
  const dots = ref([]);

  const mapSettins = {
    location: {
      center: [57.63299032783368, 40.178383991270444],
      zoom: mapZoom.value,
    },
    // behaviors: enabledBehaviors.value,
  };

  const handleClick = (event) => {
    console.log(event);
  };

  // const markers = [
  //   {
  //     coordinates: [51.789682128109, 55.140428698122],
  //     onClick: handleClick,
  //   },
  //   {
  //     coordinates: [54.76778893634, 57.108481458691],
  //     onClick: handleClick,
  //   },
  // ];

  const markers = computed(() => {
    return dots.value.map((dot) => {
      return {
        coordinates: [dot.center_latitude, dot.center_longitude],
        onClick: handleClick,
      };
    });
  });

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

    const coords = result?.coords_rect || {
      lat_lu: 46.593939604177926,
      lon_lu: 11.049821462434878,
      lat_rd: 65.96012495630457,
      lon_rd: 64.7046557389222,
    };

    // извлечение id
    landIdsFromTable.value = data.value.map((lot) => lot.id).filter(Boolean);

    const mapPayload = {
      ...coords,

      zoom: 0,
      dots_to_cluster: 64,

      search_filters: { ...filters.value, land_ids: landIdsFromTable.value },
      land_ids: landIdsFromTable.value,
    };

    const mapResult = await lotsStore.fetchMapData(mapPayload);
    console.log(mapResult);

    // Обработка ошибки
    if (!mapResult) {
      console.error('Ошибка при получении лотов для карты!');

      return;
    }

    dots.value = mapResult.dots || [];
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

  .map {
    width: 100%;
    height: 400px;
  }

  .marker {
    width: 32px;
    height: 32px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.9091 13.4288C12.9091 11.7719 14.293 10.4287 16.0001 10.4287C17.7071 10.4287 19.091 11.7719 19.091 13.4288C19.091 15.0857 17.7071 16.4289 16.0001 16.4289C14.293 16.4289 12.9091 15.0857 12.9091 13.4288Z' fill='%23262AF1'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M6.28577 13.4288C6.28577 8.22142 10.635 4 16.0001 4C21.3651 4 25.7143 8.22142 25.7143 13.4288C25.7143 18.0589 23.2095 21.7714 20.5719 24.3926C19.2614 25.6949 17.9472 26.6976 16.9606 27.3741C16.5849 27.6317 16.2584 27.8408 16.0001 28C15.7417 27.8408 15.4152 27.6317 15.0395 27.3741C14.0529 26.6976 12.7387 25.6949 11.4282 24.3926C8.7906 21.7714 6.28577 18.0589 6.28577 13.4288ZM16.0001 7.85724C12.8298 7.85724 10.2598 10.3517 10.2598 13.4288C10.2598 16.5059 12.8298 19.0004 16.0001 19.0004C19.1703 19.0004 21.7403 16.5059 21.7403 13.4288C21.7403 10.3517 19.1703 7.85724 16.0001 7.85724Z' fill='%23262AF1'/%3E%3Cpath d='M12.9091 13.4288C12.9091 11.7719 14.293 10.4287 16.0001 10.4287C17.7071 10.4287 19.091 11.7719 19.091 13.4288C19.091 15.0857 17.7071 16.4289 16.0001 16.4289C14.293 16.4289 12.9091 15.0857 12.9091 13.4288Z' fill='%23262AF1'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M6.28577 13.4288C6.28577 8.22142 10.635 4 16.0001 4C21.3651 4 25.7143 8.22142 25.7143 13.4288C25.7143 18.0589 23.2095 21.7714 20.5719 24.3926C19.2614 25.6949 17.9472 26.6976 16.9606 27.3741C16.5849 27.6317 16.2584 27.8408 16.0001 28C15.7417 27.8408 15.4152 27.6317 15.0395 27.3741C14.0529 26.6976 12.7387 25.6949 11.4282 24.3926C8.7906 21.7714 6.28577 18.0589 6.28577 13.4288ZM16.0001 7.85724C12.8298 7.85724 10.2598 10.3517 10.2598 13.4288C10.2598 16.5059 12.8298 19.0004 16.0001 19.0004C19.1703 19.0004 21.7403 16.5059 21.7403 13.4288C21.7403 10.3517 19.1703 7.85724 16.0001 7.85724Z' fill='%23262AF1'/%3E%3Cpath d='M16.0001 4C10.635 4 6.28577 8.22142 6.28577 13.4288C6.28577 18.0589 8.7906 21.7714 11.4282 24.3926C12.7387 25.6949 14.0529 26.6976 15.0395 27.3741C15.4152 27.6317 15.7417 27.8408 16.0001 28C16.2584 27.8408 16.5849 27.6317 16.9606 27.3741C17.9472 26.6976 19.2614 25.6949 20.5719 24.3926C23.2095 21.7714 25.7143 18.0589 25.7143 13.4288C25.7143 8.22142 21.3651 4 16.0001 4ZM16.0001 10.4287C14.293 10.4287 12.9091 11.7719 12.9091 13.4288C12.9091 15.0857 14.293 16.4289 16.0001 16.4289C17.7071 16.4289 19.091 15.0857 19.091 13.4288C19.091 11.7719 17.7071 10.4287 16.0001 10.4287ZM10.2598 13.4288C10.2598 10.3517 12.8298 7.85724 16.0001 7.85724C19.1703 7.85724 21.7403 10.3517 21.7403 13.4288C21.7403 16.5059 19.1703 19.0004 16.0001 19.0004C12.8298 19.0004 10.2598 16.5059 10.2598 13.4288Z' stroke='white' stroke-width='2'/%3E%3C/svg%3E%0A");
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
