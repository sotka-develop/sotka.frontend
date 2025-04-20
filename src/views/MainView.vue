<template>
  <main>
    <div class="container">
      <h2>Лоты</h2>

      <div class="form-filters">
        <div class="form-filters__items form-filters__items--4">
          <!-- Окончательная подача заявок от -->
          <div class="form-filters__item">
            <VDateInput label="Окончательная подача заявок от" v-model="biddEndTimeFromModel" placeholder="Выбрать значение" />
          </div>

          <!-- Окончательная подача заявок до -->
          <div class="form-filters__item">
            <VDateInput label="Окончательная подача заявок до" v-model="biddEndTimeToModel" placeholder="Выбрать значение" />
          </div>

          <!-- Процедура / Форма торгов -->
          <div class="form-filters__item">
            <v-select
              label="Процедура"
              placeholder="Выбрать значение"
              v-model="biddModel"
              :items="biddData"
              multiple
              item-title="text"
              item-value="value"
            ></v-select>
          </div>

          <!-- Локация / Регион -->
          <div class="form-filters__item">
            <v-select
              label="Локация"
              placeholder="Регион, область, город"
              v-model="regionsModel"
              multiple
              item-title="text"
              item-value="value"
              :items="regionsData"
            />
          </div>

          <!-- Электронная площадка / Код ЭТП -->
          <div class="form-filters__item">
            {{ codesModel }}
            <v-select
              label="Электронная площадка"
              placeholder="Выбрать значение"
              item-title="text"
              item-value="value"
              v-model="codesModel"
              :items="codesData"
              multiple
            ></v-select>
          </div>

          <!-- Кадастровый номер -->
          <div class="form-filters__item">
            <v-number-input
              v-model="cadasterNumberModel"
              :reverse="false"
              controlVariant="default"
              label="Кадастровый номер"
              :hideInput="false"
              :inset="false"
              multiple
              placeholder="Например, 1111"
            ></v-number-input>
          </div>

          <!-- Извещение, лот -->
          <div class="form-filters__item">
            <v-text-field label="Извещение, лот" v-model="lotModel" placeholder="Например, 1111"></v-text-field>
          </div>

          <!-- Составность / Композиция -->
          <div class="form-filters__item">
            <v-select
              label="Составность"
              placeholder="Выбрать значение"
              v-model="compositionModel"
              :items="compositionData"
              item-title="text"
              item-value="value"
              multiple
            ></v-select>
          </div>

          <!-- Добавлено / Дата добавления -->
          <div class="form-filters__item">
            <VDateInput label="Добавлено" v-model="addedAtModel" placeholder="Выбрать значение" />
          </div>

          <!-- Рубрики -->
          <div class="form-filters__item">
            <v-select
              label="Рубрики"
              placeholder="Выбрать значение"
              item-title="text"
              item-value="value"
              multiple
              v-model="rubricsModel"
              :items="rubricsData"
            ></v-select>
          </div>

          <!-- Категория ЗУ -->
          <div class="form-filters__item">
            <v-select
              label="Категория ЗУ"
              placeholder="Выбрать значение"
              v-model="categoryModel"
              item-title="text"
              item-value="value"
              multiple
              :items="categoryData"
            ></v-select>
          </div>
        </div>

        <div class="form-filters__items form-filters__items--1">
          <!-- ВРИ / Разрешенные использования -->
          <div class="form-filters__item">
            <v-combobox
              label="ВРИ"
              placeholder="Выбрать значение"
              item-title="text"
              item-value="value"
              :return-object="false"
              multiple
              v-model="usesModel"
              :items="usesData"
              @input="onSearchPermittedUses"
            ></v-combobox>
          </div>
        </div>

        <div class="form-filters__items form-filters__items--4">
          <!-- Начальная цена, ₽ (более) / Минимальная цена от -->
          <div class="form-filters__item">
            <v-number-input
              :reverse="false"
              controlVariant="default"
              label="Начальная цена, ₽ (более)"
              :hideInput="false"
              :inset="false"
              placeholder=""
              v-model="priceMinFromModel"
            ></v-number-input>
          </div>

          <!-- Начальная цена, ₽ (менее) / Минимальная цена до -->
          <div class="form-filters__item">
            <v-number-input
              :reverse="false"
              controlVariant="default"
              label="Начальная цена, ₽ (менее)"
              :hideInput="false"
              :inset="false"
              placeholder=""
              v-model="priceMaxFromModel"
            ></v-number-input>
          </div>

          <!-- Кадастровая стоимость от -->
          <div class="form-filters__item">
            <v-number-input
              :reverse="false"
              controlVariant="default"
              label="Кадастровая стоимость от"
              :hideInput="false"
              :inset="false"
              placeholder=""
              v-model="cadastralCostFromModel"
            ></v-number-input>
          </div>

          <!-- Кадастровая стоимость до -->
          <div class="form-filters__item">
            <v-number-input
              :reverse="false"
              controlVariant="default"
              label="Кадастровая стоимость до"
              :hideInput="false"
              :inset="false"
              placeholder=""
              v-model="cadastralCostToModel"
            ></v-number-input>
          </div>

          <!-- % соотн. нач.ц. и кад.ст от -->
          <div class="form-filters__item">
            <v-number-input
              :reverse="false"
              controlVariant="default"
              label="% соотн. нач.ц. и кад.ст от"
              :hideInput="false"
              :inset="false"
              placeholder=""
              v-model="priceMinCadastralCostRatioPercentFromModel"
            ></v-number-input>
          </div>

          <!-- % соотн. нач.ц. и кад.ст до -->
          <div class="form-filters__item">
            <v-number-input
              :reverse="false"
              controlVariant="default"
              label="% соотн. нач.ц. и кад.ст до"
              :hideInput="false"
              :inset="false"
              placeholder=""
              v-model="priceMinCadastralCostRatioPercentToModel"
            ></v-number-input>
          </div>

          <!-- Площадь от -->
          <div class="form-filters__item">
            <v-number-input
              :reverse="false"
              controlVariant="default"
              label="Площадь от"
              :hideInput="false"
              :inset="false"
              placeholder=""
              v-model="areaFromModel"
            ></v-number-input>
          </div>

          <!-- Площадь до -->
          <div class="form-filters__item">
            <v-number-input
              :reverse="false"
              controlVariant="default"
              label="Площадь до"
              :hideInput="false"
              :inset="false"
              placeholder=""
              v-model="areaToModel"
            ></v-number-input>
          </div>
        </div>

        <div class="form-filters__action">
          <Button text="Поиск" @click="onSearch" />
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
  import Button from '@/components/button/Button.vue';

  import { storeToRefs } from 'pinia';
  import { useFiltersStore } from '@/stores/filters';
  import { useLotsStore } from '@/stores/lots';

  import debounce from 'lodash.debounce';

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

  import useSearchFilters from '@/composables/useSearchFilters';

  const map = shallowRef(null);
  const mapZoom = ref(10);
  const enabledBehaviors = ref(['drag', 'pinchZoom', 'dblClick']);

  const mapSettins = {
    location: {
      center: [37.617644, 55.755819],
      zoom: mapZoom.value,
    },
    // behaviors: enabledBehaviors.value,
  };

  const handleClick = (event) => {
    console.log(event);
  };

  const markers = [
    {
      coordinates: [51.789682128109, 55.140428698122],
      onClick: handleClick,
    },
    {
      coordinates: [54.76778893634, 57.108481458691],
      onClick: handleClick,
    },
  ];

  // store
  const filtersStore = useFiltersStore();
  const lotsStore = useLotsStore();

  const { isLoading } = storeToRefs(lotsStore);

  const page = ref(1);
  const pageSize = ref(10);
  const totalCount = ref(0);

  const data = ref([]);
  const tableItems = ref([]);

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
  const compositionData = ref([
    {
      text: 'Кадастровый номер',
      value: 1,
    },
    {
      text: 'Кадастровый квартал',
      value: 2,
    },
    {
      text: 'Кадастровый район',
      value: 3,
    },
    {
      text: 'Координаты не определены',
      value: 4,
    },
  ]);

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

  //#region данные таблицы
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

  // async function onSearch() {
  //   const filters = {
  //     bidd_end_time_from: biddEndTimeFromModelFormatted.value || null,
  //     bidd_end_time_to: biddEndTimeToModelFormatted.value || null,
  //     bidd_form: biddModel.value || null,
  //     region_ids: regionsModel.value || null,
  //     etp_codes: codesModel.value || null,
  //     cadaster_number: cadasterNumberModel.value?.toString() || null,
  //     lot: lotModel.value || null,
  //     compositions: compositionModel.value || null,
  //     added_at: addedAtModelFormatted.value || null,
  //     rubric_ids: rubricsModel.value || null,
  //     categories: categoryModel.value || null,
  //     permitted_uses_id: usesModel.value || null,
  //     price_min_from: priceMinFromModel.value || null,
  //     price_min_to: priceMaxFromModel.value || null,
  //     cadastral_cost_from: cadastralCostFromModel.value || null,
  //     cadastral_cost_to: cadastralCostToModel.value || null,
  //     price_min_cadastral_cost_ratio_percent_from: priceMinCadastralCostRatioPercentFromModel.value || null,
  //     price_min_cadastral_cost_ratio_percent_to: priceMinCadastralCostRatioPercentToModel.value || null,
  //     area_from: areaFromModel.value || null,
  //     area_to: areaToModel.value || null,
  //     page: page.value - 1,
  //     page_size: pageSize.value,
  //   };

  //   const result = await lotsStore.fetchLots(filters);
  //   data.value = result?.land_areas || [];
  //   totalCount.value = result?.total_count || 0;

  //   tableItems.value = transformLotsToTable(data.value);
  // }

  async function onSearch() {
    const result = await lotsStore.fetchLots(filters.value);

    data.value = result?.land_areas || [];
    totalCount.value = result?.total_count || 0;
    tableItems.value = transformLotsToTable(data.value);
  }

  const onSearchPermittedUses = debounce(async (data) => {
    const value = data?.target?.value || '';

    const result = await filtersStore.searchPermittedUses(value, 50, 0);
    usesData.value = result.value;
  }, 800);

  function onOptionsUpdate(options) {
    page.value = options.page;
    pageSize.value = options.itemsPerPage;

    onSearch();
  }

  onMounted(async () => {
    await filtersStore.loadFilters();
  });
</script>

<style lang="scss" scoped>
  // TODO временно

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
</style>
