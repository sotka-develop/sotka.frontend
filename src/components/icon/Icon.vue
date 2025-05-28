<template>
  <div class="icon">
    <!-- logos -->
    <Logo v-if="name === 'logos/logo'" />

    <!-- 20 -->
    <Eye v-if="name === '20/eye'" />
    <ChevronLeft v-if="name === '20/chevron-left'" />
    <ChevronRight v-if="name === '20/chevron-right'" />

    <!-- 24 -->
    <Close v-if="name === '24/close'" />
    <Sync v-if="name === '24/sync'" />
    <Plus v-if="name === '24/plus'" />
    <Minus v-if="name === '24/minus'" />
    <House v-if="name === '24/house'" />
    <ArrowsPointing v-if="name === '24/arrows-pointing'" />
    <HandDraw v-if="name === '24/hand-draw'" />
    <Layers v-if="name === '24/layers'" />
    <Measuring v-if="name === '24/measuring'" />
    <MapPin v-if="name === '24/map-pin'" />
  </div>
</template>

<script setup>
  import { defineComponent } from 'vue';

  // logos
  import Logo from '@/assets/icons/logos/logo.svg';

  // 20
  import Eye from '@/assets/icons/20/eye.svg';
  import ChevronLeft from '@/assets/icons/20/chevron-left.svg';
  import ChevronRight from '@/assets/icons/20/chevron-right.svg';

  // 24
  import Close from '@/assets/icons/24/close.svg';
  import Sync from '@/assets/icons/24/sync.svg';
  import Plus from '@/assets/icons/24/plus.svg';
  import Minus from '@/assets/icons/24/minus.svg';
  import ArrowsPointing from '@/assets/icons/24/arrows-pointing.svg';
  import HandDraw from '@/assets/icons/24/hand-draw.svg';
  import Layers from '@/assets/icons/24/layers.svg';
  import Measuring from '@/assets/icons/24/measuring.svg';
  import House from '@/assets/icons/24/house.svg';
  import MapPin from '@/assets/icons/24/map-pin.svg';

  defineProps({
    name: {
      type: String,
    },
  });

  defineComponent({
    // logos
    Logo,

    // 20
    Eye,
    ChevronLeft,
    ChevronRight,
    //24
    Close,
    Sync,
    Plus,
    Minus,
    ArrowsPointing,
    HandDraw,
    Layers,
    Measuring,
    House,
    MapPin,
  });
</script>

<style lang="scss" scoped>
  @import 'Icon';
</style>
