<template>
  <div :class="['section', { 'section--hidden': !isOpen }]">
    <div class="section__top">
      <h2 v-if="title" class="section__title">{{ title }}</h2>

      <div class="section__controls">
        <div class="section__control section__control--toggle">
          <Button v-bind="buttonArrow" @click="toggle" />
        </div>
      </div>
    </div>

    <div class="section__body" ref="body">
      <div class="section__content">
        <slot />
      </div>

      <div v-if="$slots.actions" class="section__actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import Button from '@/components/button/Button.vue';
  import { ref } from 'vue';

  const buttonArrow = {
    small: true,
    prependIcon: '24/chevron-up',
    theme: 'secondary',
  };

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
  });

  const body = ref(null);
  const isOpen = ref(true);

  function toggle() {
    const el = body.value;
    if (!el) return;

    if (isOpen.value) {
      // Закрытие
      const height = el.scrollHeight;
      el.style.height = height + 'px';

      requestAnimationFrame(() => {
        el.style.height = '0px';
      });
    } else {
      // Открытие
      el.style.height = '0px';

      requestAnimationFrame(() => {
        el.style.height = el.scrollHeight + 'px';

        el.addEventListener(
          'transitionend',
          () => {
            el.style.height = 'auto';
          },
          { once: true }
        );
      });
    }

    isOpen.value = !isOpen.value;
  }
</script>

<style lang="scss" scoped>
  @import 'Section';
</style>
