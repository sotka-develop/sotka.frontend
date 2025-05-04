<template>
  <router-link v-if="isInternal" :to="href" class="link">
    <slot />
  </router-link>
  <a v-else :href="href" target="_blank" class="link" v-bind="attributes">
    <slot />
  </a>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    href: {
      type: String,
      required: true,
    },
    external: {
      type: Boolean,
      default: false,
    },
    target: {
      type: String,
      default: '_blank',
    },
    rel: {
      type: String,
      default: 'noopener noreferrer',
    },
  });

  const isInternal = computed(() => {
    return !props.external && (props.href?.startsWith('/') || props.href?.startsWith('#'));
  });
</script>
