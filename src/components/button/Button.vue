<template>
  <Link v-if="href" :href="href" :external="external" class="button" :class="classList">
    <span v-if="prependIcon" class="button__icon button__icon--prepend">
      <Icon :name="prependIcon" />
    </span>

    <span v-if="text" class="button__text text-lead">{{ text }}</span>

    <span v-if="appendIcon" class="button__icon button__icon--append">
      <Icon v-if="appendIcon" :name="appendIcon" />
    </span>
  </Link>

  <button v-else :type="type" class="button" :title="title" :disabled="disabled" :class="classList" @click="onClick">
    <span v-if="prependIcon" class="button__icon button__icon--prepend">
      <Icon :name="prependIcon" />
    </span>

    <span v-if="text" class="button__text text-lead">{{ text }}</span>

    <span v-if="appendIcon" class="button__icon button__icon--append">
      <Icon v-if="appendIcon" :name="appendIcon" />
    </span>
  </button>
</template>

<script setup>
  import { computed } from 'vue';
  import Link from '@/components/link/Link.vue';
  import Icon from '@/components/icon/Icon.vue';

  const props = defineProps({
    href: {
      type: String,
    },
    external: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    type: {
      type: String,
    },
    fit: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: 'primary',
    },
    small: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
    },
    prependIcon: {
      type: String,
    },
    appendIcon: {
      type: String,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['click']);

  const classList = computed(() => {
    return {
      [`button--${props.theme}`]: props.theme,
      ['button--fit']: props.fit,
      ['button--small']: props.small,
      ['button--disabled']: props.disabled,
      ['button--loading']: props.loading,
    };
  });

  function onClick(event) {
    emit('click', event);
  }
</script>

<style lang="scss">
  @import 'Button';
</style>
