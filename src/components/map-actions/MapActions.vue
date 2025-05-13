<template>
  <div class="map-actions">
    <div v-for="(action, idx) in actions" :key="idx" class="map-actions__action">
      <button type="button" class="map-actions__button">
        <Icon :name="action.icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
  import Icon from '@/components/icon/Icon.vue';

  const props = defineProps({});

  const actions = [
    {
      icon: '24/measuring',
    },
    {
      icon: '24/arrows-pointing',
    },
    {
      icon: '24/hand-draw',
    },
    {
      icon: '24/layers',
    },
  ];
</script>

<style lang="scss" scoped>
  @import 'MapActions';
</style>
