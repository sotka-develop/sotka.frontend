<template>
  <div class="icon">
    <Logo v-if="name === 'logos/logo'" />
  </div>
</template>

<script setup>
  import { defineComponent } from 'vue';

  // logos
  import Logo from '@/assets/icons/logos/logo.svg';

  defineProps({
    name: {
      type: String,
    },
  });

  defineComponent({
    // logos
    Logo,
  });
</script>

<style lang="scss" scoped>
  @import 'Icon';
</style>
