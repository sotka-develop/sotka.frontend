<template>
  <div class="section">
    <div class="section__top">
      <h2 v-if="title" class="section__title">{{ title }}</h2>
    </div>

    <div class="section__content">
      <slot />
    </div>

    <div v-if="$slots.actions" class="section__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    title: {
      type: String,
      default: '', // можно сделать обязательным, если нужно
    },
  });
</script>

<style lang="scss" scoped>
  @import 'Section';
</style>
