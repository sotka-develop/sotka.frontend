<template>
  <div class="map" :class="classList">
    <yandex-map
      v-model="map"
      :settings="{
        location: {
          center: center,
          zoom: mapZoom,
        },
        zoomRange: zoomRange,
        behaviors: enabledBehaviors,
      }"
      width="100%"
      height="100%"
    >
      <yandex-map-default-scheme-layer />
      <yandex-map-default-features-layer />

      <yandex-map-marker v-for="(marker, index) in markers" :key="index" :settings="marker">
        <template v-if="marker?.data?.points_count > 1">
          <div class="map__cluster" @click="onClusterClick(marker)">
            {{ marker.data.points_count }}
          </div>
        </template>
        <template v-else-if="marker?.data?.points_count === 1">
          <div class="map__point" @click="onPointClick(marker)">
            <Icon />
          </div>
        </template>
      </yandex-map-marker>
      <YandexMapListener
        :settings="{
          onUpdate: handleCoordsUpdate,
        }"
      />
    </yandex-map>

    <div class="map__controls">
      <button type="button" class="map__zoom map__zoom--in" :class="{ 'map__zoom--disabled': zoomInDisabled }" @click="zoomIn">
        <Icon name="24/plus" />
      </button>
      <button type="button" class="map__zoom map__zoom--out" :class="{ 'map__zoom--disabled': zoomOutDisabled }" @click="zoomOut">
        <Icon name="24/minus" />
      </button>
    </div>

    <div class="map__sidebar">
      <button type="button" class="map__sidebar-toggle" @click="toggleSidebar">
        <Icon name="20/chevron-left" />
      </button>

      <div class="map__sidebar-content">
        <div class="map__sidebar-loading">
          <Loader child size="small" />
        </div>

        <MapSidebar v-if="sidebar" :data="sidebar" />
      </div>
    </div>

    <div class="map__loading">
      <Loader child size="medium" />
    </div>

    <div v-if="syncStatus" class="map__bar">
      <button type="button" class="map__bar-action" @click="sync">
        <Icon name="24/sync" />

        {{ actionText }}
      </button>

      <button type="button" class="map__bar-close" @click="closeBar">
        <Icon name="24/close" />
      </button>
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

  import { computed, shallowRef, ref, watch } from 'vue';
  import Loader from '@/components/loader/Loader.vue';
  import Icon from '@/components/icon/Icon.vue';
  import MapSidebar from '../mapSidebar/MapSidebar.vue';

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
    sidebar: {
      type: Object,
    },
    sidebarStatus: {
      type: Boolean,
    },
    sidebarPending: {
      type: Boolean,
    },
    syncStatus: {
      type: Boolean,
    },
  });

  const map = shallowRef(null);
  const mapZoom = ref(3);
  const mapZoomMin = 3;
  const mapZoomMax = 12;
  const center = ref([101, 62]);
  const zoomRange = { min: 3, max: 12 };
  const isDirty = ref(false);

  const enabledBehaviors = ref(['drag', 'pinchZoom', 'dblClick']);

  const markers = computed(() =>
    props.dots.map((dot) => ({
      coordinates: [dot.center_longitude, dot.center_latitude],
      data: dot,
    }))
  );

  const classList = computed(() => {
    return {
      ['map--loading']: props.loading,
      ['map--sidebar-show']: props.sidebarStatus,
      ['map--sidebar-pending']: props.sidebarPending,
      ['map--is-dirty']: isDirty.value,
    };
  });

  const actionText = 'Обновить таблицу';

  const emit = defineEmits(['update:sidebarStatus', 'update:syncStatus', 'sync']);

  function toggleSidebar() {
    emit('update:sidebarStatus', !props.sidebarStatus);
  }

  function closeBar() {
    emit('update:syncStatus', false);
  }

  function sync() {
    emit('sync');
  }

  function handleCoordsUpdate(data) {
    const location = data.location;
    center.value = location.center;

    if (props.onCoordsUpdate) {
      props.onCoordsUpdate(data);
    }
  }

  const zoomOutDisabled = computed(() => {
    return mapZoom.value === 3;
  });

  const zoomInDisabled = computed(() => {
    return mapZoom.value === 12;
  });

  function zoomIn() {
    if (mapZoom.value < mapZoomMax) {
      mapZoom.value += 1;
    }
  }

  function zoomOut() {
    if (mapZoom.value > mapZoomMin) {
      mapZoom.value -= 1;
    }
  }

  watch(
    () => props.sidebar,
    (val) => {
      isDirty.value = true;
    }
  );
</script>

<style lang="scss" scoped>
  @import 'Map';
</style>
