<template>
  <div class="map-cluster">
    <h5 class="map-cluster__title">{{ title }}</h5>

    <div class="map-cluster__items">
      <div v-for="(item, idx) in items" :key="idx" class="map-cluster__item">
        <button type="button" class="map-cluster__button">
          <div class="map-cluster__icon">
            <Icon name="24/house" />
          </div>

          <span>{{ item.lot || 'Нет данных' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import Icon from '@/components/icon/Icon.vue';

  const title = 'Объекты';

  const props = defineProps({
    data: {
      type: Object,
    },
  });

  const items = computed(() => {
    return props?.data?.items || [];
  });
</script>

<style lang="scss" scoped>
  @import 'MapCluster';
</style>
