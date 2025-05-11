<template>
  <main class="main">
    <div class="container">
      <div class="section">
        <div class="section__title">
          <h2>Лоты</h2>
        </div>

        <FiltersForm />

        <div class="section__actions">
          <Button v-if="isFiltered" text="Применить" @click="search" />
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
          :sidebar="mapSidebarData"
          :sidebar-pending="landAreaPending"
          v-model:sidebarStatus="mapSidebarStatus"
          v-model:syncStatus="mapSyncStatus"
          @sync="tableSync"
        />
      </div>

      <div class="section">
        <div class="section__title">
          <h2>Таблицы</h2>
        </div>

        <Table
          :page="page"
          :items-per-page="pageSize"
          :items="tableItems"
          :headers="tableHeaders"
          :items-length="totalCount"
          :loading="lotsPending"
          :on-update-options="onUpdateOptions"
          @update:page="page = $event"
          @update:itemsPerPage="pageSize = $event"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue';

  import Table from '@/components/table/Table.vue';
  import Button from '@/components/button/Button.vue';
  import FiltersForm from '@/components/filtersForm/FiltersForm.vue';
  import Map from '@/components/map/Map.vue';

  import { storeToRefs } from 'pinia';
  import { useFiltersStore } from '@/stores/filters';
  import { useLotsStore } from '@/stores/lots';

  import debounce from 'lodash.debounce';

  // store
  const filtersStore = useFiltersStore();
  const lotsStore = useLotsStore();

  const { mapPending, lotsPending, landAreaPending } = storeToRefs(lotsStore);

  const isFiltered = ref(false); // фильтры применены, кнопка Применить не отображается

  //#region данные таблицы
  const page = ref(1); // текущая страница таблицы
  const pageSize = ref(10); // количество элементов на странице таблицы
  const totalCount = ref(0); // общее количество лотов

  // список лотов для текущей страницы таблицы
  const tableItems = ref([]);

  // заголовки в таблице
  const tableHeaders = [
    { title: 'Кадастровый номер', key: 'cadasterNumber', sortable: false },
    { title: 'Извещение, лот', key: 'lot', sortable: false },
    { title: 'Площадь (TG)', key: 'area', sortable: false },
    { title: 'Площадь (КН)', key: 'areaFromNspd', sortable: false },
    { title: 'Кадастровая стоимость', key: 'cadastralCostFromNspdInRub', sortable: false },
    { title: 'Начальная цена', key: 'priceMinInRub', sortable: false },
    { title: 'Задаток (р)', key: 'depositInRub', sortable: false },
    { title: 'Задаток (%)', key: 'depositPercent', sortable: false },
    { title: '% соот. НЦ и КС', key: 'priceMinCadastralCostRatioPercent', sortable: false },
    { title: 'Координаты', key: 'coords', sortable: false },
    { title: 'Оконч.подач.заяв.', key: 'biddEndTime', sortable: false },
    { title: 'Дата проведения торгов', key: 'auctionStartDate', sortable: false },
    { title: 'Форма проведения', key: 'biddFormRaw', sortable: false },
    { title: 'Вид сделки', key: 'typeTransactionRus', sortable: false },
    { title: 'ЭТП', key: 'etpCode', sortable: false },
    { title: 'Категория (TG)', key: 'categoryPurposeOrCategoryFromTorgigovProcessed', sortable: false },
    { title: 'Категория (КН)', key: 'categoryFromNspd', sortable: false },
    { title: 'ВРИ (TG)', key: 'permittedUse', sortable: false },
    { title: 'ВРИ (КН)', key: 'permittedUseEstablishedByDocumentFromNspd', sortable: false },
    { title: 'Субъект РФ', key: 'region', sortable: false },
    { title: 'Федеральный округ', key: 'federalDistrict', sortable: false },
    { title: 'Ссылка', key: 'link', sortable: false },
    { title: 'Составность', key: 'composition', sortable: false },
  ];

  // преобоазование данных лотов для таблицы
  function transformLotsToTable(lots) {
    return lots.map((lot) => ({
      cadasterNumber: lot?.cadaster_number || '-',
      lot: lot?.lot || '-',
      area: lot?.area || '-',
      areaFromNspd: lot?.area_from_nspd || '-',
      cadastralCostFromNspdInRub: lot?.cadastral_cost_from_nspd_in_rub || '-',
      priceMinInRub: lot?.price_min_in_rub || '-',
      depositInRub: lot?.deposit_in_rub || '-',
      depositPercent: lot?.deposit_percent || '-',
      priceMinCadastralCostRatioPercent: lot?.price_min_cadastral_cost_ratio_percent || '-',
      coords: `${lot?.latitude || '-'}, ${lot?.longitude || '-'}`,
      biddEndTime: lot?.bidd_end_time || '-',
      auctionStartDate: lot?.auction_start_date || '-',
      biddFormRaw: lot?.bidd_form_raw || '-',
      typeTransactionRus: lot?.type_transaction_rus || '-',
      etpCode: lot?.etp_code?.etp_code || '-',
      categoryPurposeOrCategoryFromTorgigovProcessed: lot?.category_purpose_or_category_from_torgigov_processed || '-',
      categoryFromNspd: lot?.category_from_nspd || '-',
      permittedUse: lot?.permitted_use || '-',
      permittedUseEstablishedByDocumentFromNspd: lot?.permitted_use_established_by_document_from_nspd || '-',
      region: lot?.region?.region || '-',
      federalDistrict: lot?.federal_district?.federal_district || '-',
      link: lot?.link || '-',
      composition: lot?.composition || '-',
    }));
  }
  //#endregion

  //#region карта
  const mapZoom = ref(3);
  const mapZoomDefault = 3;
  const mapDotsToCluster = ref(10);
  const mapSidebarData = ref(null);
  const mapSidebarStatus = ref(false);
  const mapSyncStatus = ref(false);

  // координаты по умолчанию - РФ целиком
  const defaultCoords = {
    lat_lu: 14,
    lon_lu: -11,
    lat_rd: 82,
    lon_rd: 180,
  };

  // отображаемые точки на карте
  const dots = ref([]);

  // список точек после обновления карты
  const landAreasIds = ref(null);

  // клик по кластеру
  const onClusterClick = (data) => {};

  // клик по точке
  const onPointClick = async (data) => {
    if (landAreaPending.value) return;

    const id = data?.data?.land_ids[0];

    if (id) {
      const result = await lotsStore.fetchLandArea(id);

      if (!result) {
        console.error('Ошибка при получении данных точки!');
        return;
      }

      mapSidebarData.value = {
        cadasterNumber: result?.cadaster_number || '-',
        latitude: result?.latitude || '-',
        longitude: result?.longitude || '-',
        biddFormRaw: result?.bidd_form_raw || '-',
        typeTransactionRus: result?.type_transaction_rus || '-',
        categoryFromNspd: result?.category_from_nspd || '-',
        permittedUseEstablishedByDocumentFromNspd: result?.permitted_use_established_by_document_from_nspd || '-',
        priceMinInRub: result?.price_min_in_rub || '-',
        cadastralCostFromNspdInRub: result?.cadastral_cost_from_nspd_in_rub || '-',
        priceMinCadastralCostRatioPercent: result?.price_min_cadastral_cost_ratio_percent | '-',
        biddEndTime: result?.bidd_end_time || '-',
        auctionStartDate: result?.auction_start_date || '-',
        etpCode: result?.etp_code?.etp_code || '-',
        link: result?.link || '-',
        categoryPurposeOrCategoryFromTorgigovProcessed: result?.category_purpose_or_category_from_torgigov_processed || '-',
        permittedUse: result?.permitted_use || '-',
        area: result?.area || '-',
      };

      mapSidebarStatus.value = true;
    }
  };

  // синхронизация таблицы с картой
  const tableSync = async () => {
    await fetchLotsData(true);

    mapSyncStatus.value = false;
  };

  // обновление карты
  const onCoordsUpdate = async (event) => {
    const filtersModel = filtersStore.getFormattedFilters(); // данные всех фильтров
    mapZoom.value = (event?.location?.zoom || mapDefaultZoom.value).toFixed(2);
    const bounds = event?.location?.bounds;
    const search_filters = { ...filtersModel, page: null, page_size: null };

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

      await loadMapData(mapPayload);

      mapSyncStatus.value = true;
    }
  };
  //#endregion

  // для пропуска onUpdateOptions после инициализации
  const isFirstOptionsUpdate = ref(true);

  // контролы таблицы
  async function onUpdateOptions(options) {
    if (isFirstOptionsUpdate.value) {
      isFirstOptionsUpdate.value = false;

      return;
    }

    page.value = options.page;
    pageSize.value = options.itemsPerPage;

    await fetchLotsData();
  }

  // получение лотов в таблице
  async function fetchLotsData(sync = false) {
    const filtersModel = filtersStore.getFormattedFilters(); // данные всех фильтров
    const pagination = {
      page: page.value, // текущая страница
      page_size: pageSize.value, // всего элементов на странице
    };

    const land_ids = sync ? landAreasIds.value : null; // null для получения всех точек
    const result = await lotsStore.fetchLots({ ...filtersModel, ...pagination, land_ids });

    if (!result) {
      console.error('Ошибка при получении лотов!');

      return;
    }

    console.log(result);

    const landAreas = result?.land_areas || []; // список сущностей
    tableItems.value = transformLotsToTable(landAreas); // преобразование к табличному виду
    totalCount.value = result?.total_count || 0; // всего сущностей
  }

  // получение точек на карте
  async function loadMapData(payload = null) {
    const filtersModel = filtersStore.getFormattedFilters(); // данные всех фильтров

    const coords = defaultCoords; // координаты
    const zoom = mapZoomDefault; // масштаб
    const dotsToCluster = mapDotsToCluster.value; // точек в кластере
    const search_filters = { ...filtersModel, page: null, page_size: null }; // все точки сразу
    const land_ids = null; // null для получения всех точек

    const defaultPayload = {
      ...coords,
      zoom,
      dots_to_cluster: dotsToCluster,
      search_filters,
      land_ids,
    };

    const mapPayload = payload ? payload : defaultPayload;

    const mapResult = await lotsStore.fetchMapData(mapPayload);

    if (!mapResult) {
      console.error('Ошибка при получении лотов для карты!');
      return;
    }

    dots.value = mapResult.dots || [];
    landAreasIds.value = (mapResult?.land_areas_ids || []).filter((item) => item);
  }

  // стартовый запрос лотов и точек
  async function initialSearch() {
    await fetchLotsData();
    await loadMapData();
  }

  onMounted(async () => {
    // получаем данные фильтров
    await filtersStore.loadFilters();

    await initialSearch();
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
