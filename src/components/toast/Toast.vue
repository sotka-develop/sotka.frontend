<template>
  <div class="toast">
    <p>{{ title }}</p>
  </div>
</template>

<script setup>
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
  });
</script>

<style lang="scss" scoped>
  @import 'Toast';
</style>
