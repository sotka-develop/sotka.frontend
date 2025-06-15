<template>
  <div class="icon">
    <img v-if="iconPath" :src="iconPath" :alt="name" class="icon__image" />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  }
});

const iconPath = computed(() => {
  try {
    return `${window.location.origin}/rubrics/${props.name}.svg`;
  } catch (e) {
    console.warn('Failed to load icon:', props.name);
    return null;
  }
});
</script>

<style lang="scss" scoped>
.icon {
  display: block;
  width: 20px;
  height: 20px;
  pointer-events: none;
  flex-shrink: 0;
  border-radius: 50%;
  padding: 2px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -70%);

  &__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-color: #fff;
    border-radius: 50%;
  }
}
</style> 