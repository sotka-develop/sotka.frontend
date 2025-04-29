<template>
  <div class="map" :class="classList">
    <yandex-map v-model="map" :settings="mapSettins" width="100%" height="100%">
      <yandex-map-default-scheme-layer />
      <yandex-map-default-features-layer />

      <yandex-map-marker v-for="(marker, index) in markers" :key="index" :settings="marker">
        <template v-if="marker?.data?.points_count > 1">
          <div class="map__cluster" @click="onClusterClick(marker)">
            {{ marker.data.points_count }}
          </div>
        </template>
        <template v-else-if="marker?.data?.points_count === 1">
          <div class="map__point" @click="onPointClick(marker)"></div>
        </template>
      </yandex-map-marker>
      <YandexMapListener
        :settings="{
          onUpdate: onCoordsUpdate,
        }"
      />
    </yandex-map>

    <div class="map__loading">
      <Loader child />
    </div>
  </div>
</template>

<script setup>
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

  import { computed, shallowRef, ref } from 'vue';
  import Loader from '@/components/loader/Loader.vue';

  // Props
  const props = defineProps({
    dots: {
      type: Array,
      default: [],
    },
    onCoordsUpdate: {
      type: Function,
    },
    onClusterClick: {
      type: Function,
    },
    onPointClick: {
      type: Function,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const map = shallowRef(null);
  const mapZoom = ref(3);

  const mapSettins = {
    location: {
      center: [101, 62],
      zoom: mapZoom.value,
    },
    zoomRange: { min: 3, max: 12 },
  };

  const markers = computed(() =>
    props.dots.map((dot) => ({
      coordinates: [dot.center_latitude, dot.center_longitude],
      data: dot,
    }))
  );

  const classList = computed(() => {
    return {
      ['map--loading']: props.loading,
    };
  });
</script>

<style lang="scss" scoped>
  @import 'Map';
</style>
