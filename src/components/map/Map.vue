<template>
  <div class="map" :class="classList" ref="mapRef">
    <div class="map__top">
      <div class="map__message text-small" :class="{ 'is-active': showMessage }">{{ preventMessage }}</div>
      <div class="map__actions">
        <div v-for="(action, idx) in actions" :key="action.name" class="map__action">
          <button class="map__action-button" @click="action.handler" :data-map-action-button="action.name">
            <Icon :name="action.icon" />
          </button>
        </div>

        <div class="map__list">
          <p class="map__list-title text-small">
            {{ actionList.title }}
          </p>

          <div v-for="(item, idx) in actionList.items" :key="item.name" class="map__list-item">
            <button type="button" @click="item.handler" class="map__list-action" :class="{ 'is-active': item.name === activeMapView }">
              {{ item.text }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <yandex-map
      v-model="map"
      :settings="{
        location: {
          center: center,
          zoom: zoom,
        },
        zoomRange: zoomRange,
        behaviors: enabledBehaviors,
      }"
      width="100%"
      height="100%"
    >
      <yandex-map-default-scheme-layer :settings="{ visible: activeMapView === 'scheme' }" />
      <yandex-map-default-satellite-layer :settings="{ visible: activeMapView === 'satellite' }" />
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

      <yandex-map-feature v-for="(feature, index) in features" :key="index" :settings="feature" />

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

        <MapPoint v-if="pointData" :data="pointData" @centering="centering" />

        <MapCluster v-if="clusterData" :data="clusterData" @centering="centering" />
      </div>
    </div>

    <div class="map__loading">
      <Loader child size="medium" />
    </div>

    <div v-if="syncStatus" class="map__bar">
      <button type="button" class="map__bar-action" @click="sync">
        <Icon name="24/sync" />

        {{ syncText }}
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
    YandexMapListener,
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultSatelliteLayer,
    YandexMapDefaultSchemeLayer,
    YandexMapMarker,
    YandexMapFeature,
  } from 'vue-yandex-maps';

  import { computed, shallowRef, ref, watch, onMounted, onUnmounted } from 'vue';
  import Loader from '@/components/loader/Loader.vue';
  import Icon from '@/components/icon/Icon.vue';
  import MapPoint from '../mapPoint/MapPoint.vue';
  import MapCluster from '../mapCluster/MapCluster.vue';

  import debounce from 'lodash.debounce';
  import { supportsTouch } from '@/assets/js/utils/isTouch';

  import { useKeyPressed } from '@/composables/useKeyPressed';
  import { useTouchDevice } from '@/composables/useTouchDevice';
  import { disableScroll, enableScroll } from '@/composables/useScrollLock';

  const { ctrlPressed } = useKeyPressed();
  const { isTouchDevice } = useTouchDevice();

  // Props
  const props = defineProps({
    dots: {
      type: Array,
      default: [],
    },
    polygons: {
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
    pointData: {
      type: Object,
    },
    clusterData: {
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

  const mapRef = ref(null);
  const map = shallowRef(null);
  const zoom = ref(3);
  const zoomDefault = 3;
  const prevZoom = ref(3);
  const zoomMin = 3;
  const zoomMax = 21;
  const zoomRange = { min: zoomMin, max: zoomMax };
  const center = ref([101, 62]);
  const centerDefault = [101, 62];
  const prevCenter = ref([101, 62]);
  const isDirty = ref(false);
  const enabledBehaviors = ref(['drag']);

  const actions = [
    // { icon: '24/measuring', name: 'measuring', handler: () => {} },
    {
      icon: '24/arrows-pointing',
      name: 'fullscreen',
      handler: () => {
        toggleFullscreen();
      },
    },
    // { icon: '24/hand-draw', name: 'draw', handler: () => {} },
    {
      icon: '24/layers',
      name: 'layers',
      handler: () => {
        toggleList();
      },
    },
  ];

  const actionList = {
    title: 'Базовая карта',
    items: [
      {
        text: 'Схема',
        name: 'scheme',
        handler: () => {
          setMapView('scheme');
          listShow.value = false;
        },
      },
      {
        text: 'Спутник',
        name: 'satellite',
        handler: () => {
          setMapView('satellite');
          listShow.value = false;
        },
      },
    ],
  };

  const listShow = ref(false);
  const activeMapView = ref('scheme');
  const activeMapViewDefault = 'scheme';

  function setMapView(payload) {
    activeMapView.value = payload;
  }

  function toggleList() {
    listShow.value = !listShow.value;
  }

  const fullscreen = ref(false);

  function toggleFullscreen() {
    fullscreen.value = !fullscreen.value;
  }

  // Точки/метки
  const markers = computed(() =>
    props.dots.map((dot) => ({
      coordinates: [dot.center_longitude, dot.center_latitude],
      data: dot,
    }))
  );

  // Настройка и стилизация полигонов
  const defaultSettings = {
    geometry: {
      type: 'Polygon',
    },
    style: {
      stroke: [
        {
          color: '#0469FF',
          width: 1,
        },
      ],
      fill: 'rgba(4, 105, 255, 0.1)',
    },
  };

  // Все полигоны
  const features = computed(() => {
    if (!polygonsArray.value || !polygonsArray.value.length) return [];

    return polygonsArray.value.map((item) => {
      return {
        ...defaultSettings,
        geometry: {
          ...defaultSettings.geometry,
          coordinates: [item],
        },
      };
    });
  });

  // Массив координат полигонов
  const polygonsArray = computed(() => {
    if (!props.polygons || !props.polygons.length) return [[]];

    return props.polygons.map((item) => {
      return [...item[0].map((coords) => [coords[0], coords[1]])];
    });
  });

  const classList = computed(() => {
    return {
      ['map--loading']: props.loading,
      ['map--sidebar-show']: props.sidebarStatus,
      ['map--sidebar-pending']: props.sidebarPending,
      ['map--is-dirty']: isDirty.value,
      ['map--list-show']: listShow.value,
      ['map--fullscreen']: fullscreen.value,
    };
  });

  const showMessage = ref(false);
  const preventMessage = computed(() => {
    if (isTouchDevice()) {
      return 'Нажмите на карту два раза, чтобы взаимодействовать с картой';
    }

    return 'Зажмите Ctrl, чтобы изменить масштаб';
  });

  const syncText = 'Обновить таблицу';

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

  const resetMap = () => {
    isDirty.value = false;
    zoom.value = zoomDefault;
    center.value = centerDefault;
  };

  defineExpose({
    resetMap,
  });

  const handleCoordsUpdate = debounce((data) => {
    const location = data.location;
    center.value = location.center;
    zoom.value = location.zoom || zoomDefault;

    // если координаты и масштаб не изменились
    const zoomIsEqual = Math.round(zoom.value) === Math.round(prevZoom.value);
    const centerIsEqual = center.value.every((v, i) => v === prevCenter.value[i]);

    console.log(center.value);

    if (zoomIsEqual && centerIsEqual) return;

    prevCenter.value = center.value;
    prevZoom.value = zoom.value;

    if (props.onCoordsUpdate) {
      props.onCoordsUpdate(data);
    }
  }, 1000);

  const zoomOutDisabled = computed(() => {
    return zoom.value === zoomMin;
  });

  const zoomInDisabled = computed(() => {
    return zoom.value === zoomMax;
  });

  function zoomIn() {
    if (zoom.value < zoomMax) {
      zoom.value = Math.floor(zoom.value + 1);
    }
  }

  function zoomOut() {
    if (zoom.value > zoomMin) {
      zoom.value = Math.floor(zoom.value - 1);
    }
  }

  function centering(centerCoords) {
    center.value = centerCoords;
  }

  watch(
    () => props.pointData,
    (val) => {
      isDirty.value = true;
    }
  );

  watch(
    () => props.clusterData,
    (val) => {
      isDirty.value = true;
    }
  );

  watch(
    () => fullscreen.value,
    (val) => {
      if (val) {
        disableScroll();
      } else {
        enableScroll();
      }
    }
  );

  watch([() => ctrlPressed.value, () => fullscreen.value], ([isCtrl, isFs]) => {
    if (isFs) {
      showMessage.value = false;
      enabledBehaviors.value = ['scrollZoom', 'drag'];

      return;
    }

    if (isCtrl) {
      showMessage.value = false;
      enabledBehaviors.value = ['scrollZoom', 'drag'];
    } else {
      enabledBehaviors.value = ['drag'];
    }
  });

  const handleClickOutside = (e) => {
    const isLayersButton = e.target.hasAttribute('data-map-action-button') && e.target.getAttribute('data-map-action-button') === 'layers';
    const isInsideLayersButton = e.target.closest('[data-map-action-button="layers"]');
    const isInsideMapList = e.target.closest('.map__list');

    if (!isLayersButton && !isInsideLayersButton && !isInsideMapList) {
      listShow.value = false;
    }
  };

  onMounted(() => {
    mapRef.value.addEventListener('wheel', (e) => {
      showMessage.value = true;

      if (ctrlPressed.value) {
        showMessage.value = false;
        e.preventDefault();
      }
    });

    mapRef.value.addEventListener('touchstart', (e) => {
      // ?
    });

    mapRef.value.addEventListener('touchend', (e) => {
      showMessage.value = false;
    });
    mapRef.value.addEventListener('mouseleave', (e) => {
      showMessage.value = false;
    });

    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<style lang="scss" scoped>
  @import 'Map';
</style>
