<template>
  <div class="map-cluster">
    <SimpleBar class="map-cluster__bar" data-simplebar-auto-hide="false">
      <div class="map-cluster__content">
        <h5 class="map-cluster__title">{{ title }}</h5>

        <div class="map-cluster__items">
          <div v-for="(item, idx) in paginatedItems" :key="idx" class="map-cluster__item">
            <button type="button" class="map-cluster__button" @click="showPointData(item)">
              <div class="map-cluster__icon">
                <Icon name="24/house" />
              </div>

              <span>{{ item.lot || 'Нет данных' }}</span>
            </button>
          </div>
        </div>

        <div v-if="showPagination" class="map-cluster__pagination">
          <Pagination v-model="currentPage" :length="pageCount" />
        </div>
      </div>
    </SimpleBar>

    <div v-if="pointData" class="map-cluster__point">
      <button type="button" class="map-cluster__back" @click="hidePoint">
        <Icon name="20/chevron-left" />

        <span class="text-lead">{{ backButtonText }}</span>
      </button>

      <div class="map-cluster__point-content">
        <MapPoint :data="pointData" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import Icon from '@/components/icon/Icon.vue';
  import Pagination from '@/components/pagination/Pagination.vue';
  import MapPoint from '../mapPoint/MapPoint.vue';

  import { preparePointData } from '@/composables/usePointData';

  const title = 'Объекты';

  const props = defineProps({
    data: {
      type: Object,
    },
  });

  const items = computed(() => {
    return props?.data?.items || [];
  });

  // сколько элементов на странице
  const perPage = 10;

  // текущая страница
  const currentPage = ref(1);

  // число страниц
  const pageCount = computed(() => {
    return Math.ceil(items.value.length / perPage);
  });

  const showPagination = computed(() => {
    return items.value.length > 10;
  });

  // элементы текущей страницы
  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    const end = start + perPage;

    return items.value.slice(start, end);
  });

  const pointData = ref(null);

  function showPointData(data) {
    pointData.value = preparePointData(data);
  }

  function hidePoint() {
    pointData.value = null;
  }

  const backButtonText = 'Объекты';

  // сброс номера страницы, если меняется количество элементов
  watch(items, (newArr) => {
    currentPage.value = 1;
  });
</script>

<style lang="scss" scoped>
  @import 'MapCluster';
</style>
