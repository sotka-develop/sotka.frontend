<template>
  <main class="main">
    <div class="container">
      <div class="mb-24">
        <Section title="Лоты">
          <FiltersForm />

          <template #actions>
            <Button v-if="isDirty" text="Сбросить фильтры" theme="light" prepend-icon="24/close" @click="reset" />
            <Button text="Применить" @click="filter" />
          </template>
        </Section>
      </div>

      <div class="mb-24">
        <Section title="Карта">
          <Map
            ref="mapRef"
            :dots="dots"
            :polygons="polygons"
            :onCoordsUpdate="onCoordsUpdate"
            :onClusterClick="onClusterClick"
            :onPointClick="onPointClick"
            :loading="mapPending"
            :point-data="mapPointData"
            :cluster-data="mapClusterData"
            :sidebar-pending="sidebarPending"
            v-model:sidebarStatus="mapSidebarStatus"
            v-model:syncStatus="mapSyncStatus"
            @sync="tableSync"
          />
        </Section>
      </div>

      <div class="mb-24">
        <Section title="Таблица">
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
        </Section>
      </div>
    </div>
  </main>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue';

  import Section from '@/components/section/Section.vue';
  import Table from '@/components/table/Table.vue';
  import Button from '@/components/button/Button.vue';
  import FiltersForm from '@/components/filtersForm/FiltersForm.vue';
  import Map from '@/components/map/Map.vue';

  import { storeToRefs } from 'pinia';
  import { useFiltersStore } from '@/stores/filters';
  import { useLotsStore } from '@/stores/lots';

  import { preparePointData } from '@/composables/usePointData';

  // store
  const filtersStore = useFiltersStore();
  const lotsStore = useLotsStore();

  const { mapPending, lotsPending, landAreaPending, clusterPending } = storeToRefs(lotsStore);
  const { isDirty } = storeToRefs(filtersStore);

  const isFiltered = ref(false); // фильтры применены, кнопка Применить неактивна
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
    { title: 'Форма проведения', key: 'bidd_form', sortable: true },
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

  function formatCadastralRatio(value) {
    if (value == null || value === '') return '-';

    return Number(value) === 0 ? '<1' : value || '-';
  }

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
      price_min_cadastral_cost_ratio_percent: formatCadastralRatio(safeValue(lot?.price_min_cadastral_cost_ratio_percent)),
      coords: `${safeValue(lot?.latitude)}, ${safeValue(lot?.longitude)}`,
      bidd_end_time: safeValue(lot?.bidd_end_time),
      auction_start_date: safeValue(lot?.auction_start_date),
      biddForm: safeValue(lot?.bidd_form?.bidd_form),
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
  const mapPointData = ref(null);
  const mapClusterData = ref(null);
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
    if (sidebarPending.value) return;

    const id = data?.data?.cluster_id;

    if (id) {
      const filtersModel = filtersData.value;

      const pagination = {
        page: 1,
        page_size: 10,
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
        zoom: mapZoom.value,
        dots_to_cluster: mapDotsToCluster.value,
        land_ids: null,
        cluster_id: id,
      };

      const result = await lotsStore.fetchClusterData({ ...clusterPayload }, pagination);

      if (!result) {
        console.error('Ошибка при получении данных точки!');
        return;
      }

      mapPointData.value = null;

      mapClusterData.value = {
        items: result?.land_areas || [],
      };

      mapSidebarStatus.value = true;

      console.log(result);
    }
  };

  // клик по точке
  const onPointClick = async (data) => {
    if (sidebarPending.value) return;

    const id = data?.data?.land_ids[0];

    if (id) {
      const result = await lotsStore.fetchLandArea(id);

      if (!result) {
        console.error('Ошибка при получении данных точки!');
        return;
      }

      mapClusterData.value = null;

      mapPointData.value = preparePointData(result);

      mapSidebarStatus.value = true;
    }
  };

  const sidebarPending = computed(() => {
    return landAreaPending.value || clusterPending.value;
  });

  // синхронизация таблицы с картой
  const tableSync = async () => {
    await fetchLotsData(true);

    mapSyncStatus.value = false;
  };

  // обновление карты
  const onCoordsUpdate = async (event) => {
    if (isFiltering.value) {
      isFiltering.value = false;
      mapSyncStatus.value = false;

      return;
    }

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

    if (isDirty.value) {
      isFiltered.value = true;
    } else {
      isFiltered.value = false;
    }
  }

  async function reset() {
    filtersStore.resetFilters();

    if (!isFiltered.value) return;

    await filter();
  }

  onMounted(async () => {
    filtersData.value = filtersStore.getFormattedFilters();

    // получение данных по доступным фильтрам
    await filtersStore.baseFilters();
    // получаем данные фильтров
    await filtersStore.loadFilters();

    await initialSearch();
  });
</script>
