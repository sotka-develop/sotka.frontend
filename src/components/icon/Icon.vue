<template>
  <div class="icon">
    <!-- logos -->
    <Logo v-if="name === 'logos/logo'" />

    <!-- 20 -->
    <Eye v-if="name === '20/eye'" />
    <ChevronLeft v-if="name === '20/chevron-left'" />

    <!-- 24 -->
    <Close v-if="name === '24/close'" />
    <Sync v-if="name === '24/sync'" />
    <Plus v-if="name === '24/plus'" />
    <Minus v-if="name === '24/minus'" />
  </div>
</template>

<script setup>
  import { defineComponent } from 'vue';

  // logos
  import Logo from '@/assets/icons/logos/logo.svg';

  // 20
  import Eye from '@/assets/icons/20/eye.svg';
  import ChevronLeft from '@/assets/icons/20/chevron-left.svg';

  // 24
  import Close from '@/assets/icons/24/close.svg';
  import Sync from '@/assets/icons/24/sync.svg';
  import Plus from '@/assets/icons/24/plus.svg';
  import Minus from '@/assets/icons/24/minus.svg';

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

    //24
    Close,
    Sync,
    Plus,
    Minus,
  });
</script>

<style lang="scss" scoped>
  @import 'Icon';
</style>
