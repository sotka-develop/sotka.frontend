<template>
  <div class="icon">
    <!-- logos -->
    <Logo v-if="name === 'logos/logo'" />

    <!-- 20 -->
    <Eye v-if="name === '20/eye'" />
  </div>
</template>

<script setup>
  import { defineComponent } from 'vue';

  // logos
  import Logo from '@/assets/icons/logos/logo.svg';

  // 20
  import Eye from '@/assets/icons/20/eye.svg';

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
  });
</script>

<style lang="scss" scoped>
  @import 'Icon';
</style>
