<template>
  <div class="map-cluster">
    <SimpleBar class="map-cluster__bar" data-simplebar-auto-hide="false">
      <div class="map-cluster__content">
        <h5 class="map-cluster__title">{{ title }}</h5>

        <div class="map-cluster__items">
          <div v-for="(item, idx) in items" :key="idx" class="map-cluster__item">
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
        <MapPoint :data="pointData" @centering="centeringOnPoint" />
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

  const emit = defineEmits(['centering', 'changePage']);

  const items = computed(() => props.data.items || []);
  const totalItems = computed(() => props.data.total || 0);
  const perPage = computed(() => props.data.pagination?.page_size || 10);
  const currentPage = ref(props.data.pagination?.page || 1);

  watch(
    () => props.data.pagination?.page,
    (newPage) => {
      currentPage.value = newPage;
    }
  );

  watch(currentPage, (newPage) => {
    if (newPage !== props.data.pagination?.page) {
      emit('changePage', newPage);
    }
  });

  const pageCount = computed(() => Math.ceil(totalItems.value / perPage.value));
  const showPagination = computed(() => totalItems.value > perPage.value);

  const pointData = ref(null);

  function showPointData(data) {
    pointData.value = preparePointData(data);
  }

  function hidePoint() {
    pointData.value = null;
  }

  const backButtonText = 'Объекты';

  function centeringOnPoint(centerCoords) {
    emit('centering', centerCoords);
  }
</script>

<style lang="scss" scoped>
  @import 'MapCluster';
</style>
