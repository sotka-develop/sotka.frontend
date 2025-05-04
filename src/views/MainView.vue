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
  import { onMounted, ref } from 'vue';

  import Table from '@/components/table/Table.vue';
  import Button from '@/components/Appbutton/Button.vue';
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

  const isFirstOptionsUpdate = ref(true);
  const isFiltered = ref(false); // фильтры применены, кнопка Применить не отображается

  //#region данные таблицы
  const page = ref(1);
  const pageSize = ref(10);
  const totalCount = ref(0);

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

  //#region карта
  const mapZoom = ref(3);
  const mapZoomDefault = 3;
  const mapDotsToCluster = ref(64);
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
      console.log(id);

      const landAreaResult = await lotsStore.fetchLandArea(id);
      mapSidebarData.value = landAreaResult;

      if (!landAreaResult) {
        console.error('Ошибка при получении данных точки!');
        return;
      }

      mapSidebarStatus.value = true;
    }
  };

  // синхронизация таблицы с картой
  const tableSync = async () => {
    await fetchLotsData(true);

    mapSyncStatus.value = false;
  };

  // обновление карты
  const onCoordsUpdate = debounce(async (event) => {
    const filtersModel = filtersStore.getFormattedFilters(); // данные всех фильтров

    mapZoom.value = Math.floor(event?.location?.zoom || mapDefaultZoom.value);

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
  }, 1000);
  //#endregion

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
