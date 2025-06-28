<template>
  <div class="tooltip">
    <button ref="tippy" v-tippy="content" :allow-html="true" type="button" class="tooltip__button">
      <Icon :name="icon" />
    </button>
  </div>
</template>

<script setup>
  import Icon from '@/components/icon/Icon.vue';
  import { computed } from 'vue';

  const props = defineProps({
    icon: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    trigger: {
      type: String,
      default: () => 'click',
    },
    interactive: {
      type: Boolean,
      default: () => false,
    },
  });

  const content = computed(() => {
    return {
      allowHTML: true,
      placement: 'auto',
      content: props.text,
      trigger: props.trigger,
      interactive: props.interactive,
      maxWidth: 280,
    };
  });
</script>

<style lang="scss" scoped>
  @import 'Tooltip';
</style>
