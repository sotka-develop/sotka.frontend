<template>
  <main class="main">
    <div class="container">
      <div class="section">
        <div class="section__title">
          <h2>Лоты</h2>
        </div>

        <FiltersForm />

        <div class="section__actions">
          <Button text="Применить" @click="filter" />
        </div>
      </div>

      <div class="section">
        <div class="section__title">
          <h2>Карта</h2>
        </div>
        <Map
          ref="mapRef"
          :dots="dots"
          :polygons="polygons"
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

  // store
  const filtersStore = useFiltersStore();
  const lotsStore = useLotsStore();

  const { mapPending, lotsPending, landAreaPending, clusterPending } = storeToRefs(lotsStore);

  const isFiltered = ref(false); // фильтры применены, кнопка Применить не отображается
  const filtersData = ref(null);
  const isFiltering = ref(false); // идет фильтрация

  //#region данные таблицы
  const page = ref(1); // текущая страница таблицы
  const pageDefaultValue = 1;
  const pageSize = ref(10); // количество элементов на странице таблицы
  const pageSizeDefaultValue = 10;
  const totalCount = ref(0); // общее количество лотов
  const sortKey = ref(null);
  const sortOrder = ref(null);

  const clusterPage = ref(1);
  const clusterPageSize = ref(10);

  // список лотов для текущей страницы таблицы
  const tableItems = ref([]);

  // заголовки в таблице
  const tableHeaders = [
    { title: 'Кадастровый номер', key: 'cadaster_number', sortable: true },
    { title: 'Извещение, лот', key: 'lot', sortable: true },
    { title: 'Площадь (TG)', key: 'area', sortable: true },
    { title: 'Площадь (КН)', key: 'area_from_nspd', sortable: true },
    { title: 'Кадастровая стоимость', key: 'cadastral_cost_from_nspd_in_rub', sortable: true },
    { title: 'Начальная цена', key: 'price_min_in_rub', sortable: true },
    { title: 'Задаток (р)', key: 'deposit_in_rub', sortable: true },
    { title: 'Задаток (%)', key: 'deposit_percent', sortable: true },
    { title: '% соот. НЦ и КС', key: 'price_min_cadastral_cost_ratio_percent', sortable: true },
    { title: 'Координаты', key: 'coords', sortable: true },
    { title: 'Оконч.подач.заяв.', key: 'bidd_end_time', sortable: true },
    { title: 'Дата проведения торгов', key: 'auction_start_date', sortable: true },
    { title: 'Форма проведения', key: 'bidd_form_raw', sortable: true },
    { title: 'Вид сделки', key: 'type_transaction_rus', sortable: true },
    { title: 'ЭТП', key: 'etp_code', sortable: true },
    { title: 'Категория (TG)', key: 'category_purpose_or_category_from_torgigov_processed', sortable: true },
    { title: 'Категория (КН)', key: 'category_from_nspd', sortable: true },
    { title: 'ВРИ (TG)', key: 'permitted_use', sortable: true },
    { title: 'ВРИ (КН)', key: 'permitted_use_established_by_document_from_nspd', sortable: true },
    { title: 'Субъект РФ', key: 'region', sortable: true },
    { title: 'Федеральный округ', key: 'federal_district', sortable: true },
    { title: 'Ссылка', key: 'link', sortable: true },
    { title: 'Составность', key: 'compositions', sortable: true },
  ];

  const safeValue = (val) => ((val ?? '') === '' ? '-' : val);

  // преобоазование данных лотов для таблицы
  function transformLotsToTable(lots) {
    return lots.map((lot) => ({
      cadaster_number: safeValue(lot?.cadaster_number),
      lot: safeValue(lot?.lot),
      area: safeValue(lot?.area),
      area_from_nspd: safeValue(lot?.area_from_nspd),
      cadastral_cost_from_nspd_in_rub: safeValue(lot?.cadastral_cost_from_nspd_in_rub),
      price_min_in_rub: safeValue(lot?.price_min_in_rub),
      deposit_in_rub: safeValue(lot?.deposit_in_rub),
      deposit_percent: safeValue(lot?.deposit_percent),
      price_min_cadastral_cost_ratio_percent: safeValue(lot?.price_min_cadastral_cost_ratio_percent),
      coords: `${safeValue(lot?.latitude)}, ${safeValue(lot?.longitude)}`,
      bidd_end_time: safeValue(lot?.bidd_end_time),
      auction_start_date: safeValue(lot?.auction_start_date),
      bidd_form_raw: safeValue(lot?.bidd_form_raw),
      type_transaction_rus: safeValue(lot?.type_transaction_rus),
      etp_code: safeValue(lot?.etp_code?.etp_code),
      category_purpose_or_category_from_torgigov_processed: safeValue(lot?.category_purpose_or_category_from_torgigov_processed),
      category_from_nspd: safeValue(lot?.category_from_nspd),
      permitted_use: safeValue(lot?.permitted_use),
      permitted_use_established_by_document_from_nspd: safeValue(lot?.permitted_use_established_by_document_from_nspd),
      region: safeValue(lot?.region?.region),
      federal_district: safeValue(lot?.federal_district?.federal_district),
      link: safeValue(lot?.link),
      compositions: safeValue(lot?.compositions),
    }));
  }
  //#endregion

  //#region карта
  const mapRef = ref(null);
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

  const currentCoords = ref(defaultCoords);

  // отображаемые точки на карте
  const dots = ref([]);

  // полигоны
  const polygons = ref([]);

  // список точек после обновления карты
  const landAreasIds = ref(null);

  // клик по кластеру
  const onClusterClick = async (data) => {
    if (clusterPending.value) return;

    const id = data?.data?.cluster_id;

    if (id) {
      const filtersModel = filtersData.value;

      const pagination = {
        page: clusterPage.value,
        page_size: clusterPageSize.value,
      };

      if (sortKey.value && sortOrder.value) {
        pagination.sort_by = {
          field: sortKey.value,
          sort_type: sortOrder.value.toUpperCase(),
        };
      }

      const clusterPayload = {
        ...currentCoords.value,
        ...filtersModel,
        ...pagination,
        zoom: mapZoom.value,
        dots_to_cluster: mapDotsToCluster.value,
        land_ids: null,
        cluster_id: id,
      };

      const result = await lotsStore.fetchClusterData({ ...clusterPayload });

      if (!result) {
        console.error('Ошибка при получении данных точки!');
        return;
      }

      console.log(result);
    }
  };

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
    if (isFiltering.value) return;

    const filtersModel = filtersData.value;

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

      currentCoords.value = coords;

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

    sortKey.value = options?.sortBy?.[0]?.key || null;
    sortOrder.value = options?.sortBy?.[0]?.order || null;

    await fetchLotsData();
  }

  // получение лотов в таблице
  async function fetchLotsData(sync = false) {
    //const filtersModel = filtersStore.getFormattedFilters(); // данные всех фильтров
    const filtersModel = filtersData.value;

    const pagination = {
      page: page.value, // текущая страница
      page_size: pageSize.value, // всего элементов на странице
    };

    if (sortKey.value && sortOrder.value) {
      pagination.sort_by = {
        field: sortKey.value,
        sort_type: sortOrder.value.toUpperCase(),
      };
    }

    const land_ids = sync ? landAreasIds.value : null; // null для получения всех точек
    const result = await lotsStore.fetchLots({ ...filtersModel, ...pagination, land_ids });

    if (!result) {
      console.error('Ошибка при получении лотов!');

      return;
    }

    const landAreas = result?.land_areas || []; // список сущностей
    tableItems.value = transformLotsToTable(landAreas); // преобразование к табличному виду
    totalCount.value = result?.total_count || 0; // всего сущностей
  }

  // получение точек на карте
  async function loadMapData(payload = null) {
    const filtersModel = filtersData.value;

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
    polygons.value = mapResult.polygons || [];
    landAreasIds.value = (mapResult?.land_areas_ids || []).filter((item) => item);
  }

  // стартовый запрос лотов и точек
  async function initialSearch() {
    await fetchLotsData();
    await loadMapData();
  }

  async function filter() {
    isFiltering.value = true;

    filtersData.value = filtersStore.getFormattedFilters();
    page.value = pageDefaultValue;
    pageSize.value = pageSizeDefaultValue;

    mapSidebarStatus.value = false;

    if (mapRef.value) {
      mapRef.value.resetMap();
    }

    await fetchLotsData();
    await loadMapData();

    await new Promise((resolve) => setTimeout(resolve, 1100));
    isFiltering.value = false;
  }

  onMounted(async () => {
    filtersData.value = filtersStore.getFormattedFilters();

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
