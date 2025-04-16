<template>
  <img :src="src" :alt="alt" class="image" />
</template>

<script setup>
  defineProps({
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: '',
    },
  });
</script>

<style lang="scss" scoped>
  @import './Image';
</style>
