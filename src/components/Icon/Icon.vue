<template>
  <div class="icon">
    <!-- logos -->
    <Logo v-if="name === 'logos/logo'" />

    <!-- 20 -->
    <Eye v-if="name === '20/eye'" />

    <!-- 24 -->
    <Close v-if="name === '24/close'" />
    <Sync v-if="name === '24/sync'" />
  </div>
</template>

<script setup>
  import { defineComponent } from 'vue';

  // logos
  import Logo from '@/assets/icons/logos/logo.svg';

  // 20
  import Eye from '@/assets/icons/20/eye.svg';

  // 24
  import Close from '@/assets/icons/24/close.svg';
  import Sync from '@/assets/icons/24/sync.svg';

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

    //24
    Close,
    Sync,
  });
</script>

<style lang="scss" scoped>
  @import 'Icon';
</style>
