<template>
  <div class="preloader" :class="classList">
    <div class="preloader__frame">
      <div class="preloader__spinner" />
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    child: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
    },
  });

  const classList = computed(() => {
    return {
      ['preloader--child']: props.child,
      [`preloader--${props.size}`]: props.size,
    };
  });
</script>

<style lang="scss" scoped>
  @import 'Loader';
</style>
