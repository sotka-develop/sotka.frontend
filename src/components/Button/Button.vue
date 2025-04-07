<template>
  <v-btn :title="title" :type="type" @click="onClick">{{ text }}</v-btn>
</template>

<script setup>
  const props = defineProps({
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    type: {
      type: String,
    },
  });

  const emit = defineEmits(['click']);

  function onClick(event) {
    emit('click', event);
  }
</script>

<style lang="scss" scoped>
  @import 'Button';
</style>
