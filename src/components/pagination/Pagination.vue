<template>
  <div class="pagination">
    <button
      type="button"
      class="pagination__button pagination__button--prev"
      :class="{ 'pagination__button--disabled': prevDisabled }"
      @click="goPrev"
    >
      <Icon name="20/chevron-left" />
    </button>

    <div class="pagination__items">
      <template v-for="(p, i) in pages" :key="i">
        <span v-if="p === '...'" class="pagination__button pagination__button--ellipsis">
          <span class="pagination__text h6">…</span>
        </span>

        <button
          v-else
          type="button"
          class="pagination__button"
          :class="{ 'pagination__button--active': p === modelValue }"
          @click="goPage(p)"
        >
          <span class="pagination__text h6">{{ p }}</span>
        </button>
      </template>
    </div>

    <button
      type="button"
      class="pagination__button pagination__button--next"
      :class="{ 'pagination__button--disabled': nextDisabled }"
      @click="goNext"
    >
      <Icon name="20/chevron-right" />
    </button>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import Icon from '@/components/icon/Icon.vue';

  const props = defineProps({
    modelValue: {
      type: Number,
      default: 1,
    },
    length: {
      type: Number,
      required: true,
    },
  });

  const emit = defineEmits(['update:modelValue']);

  // Массив кнопок
  const pages = computed(() => {
    const n = props.length;
    const cp = props.modelValue;

    if (n <= 4) {
      // Если всего страниц <= 4
      return Array.from({ length: n }, (_, i) => i + 1);
    }

    if (cp <= 2) {
      //  Начало: 1 2 ... n
      return [1, 2, '...', n];
    }

    if (cp >= n - 1) {
      //  Конец: n-3 n-2 n-1 n
      return [n - 3, n - 2, n - 1, n];
    }

    // Центр: cp cp+1 ... n
    return [cp, cp + 1, '...', n];
  });

  // Блокировка стрелок
  const prevDisabled = computed(() => props.modelValue <= 1);
  const nextDisabled = computed(() => props.modelValue >= props.length);

  // Навигация
  function goPage(p) {
    if (p === '...') return;

    emit('update:modelValue', p);
  }

  function goPrev() {
    if (!prevDisabled.value) {
      emit('update:modelValue', props.modelValue - 1);
    }
  }

  function goNext() {
    if (!nextDisabled.value) {
      emit('update:modelValue', props.modelValue + 1);
    }
  }
</script>

<style lang="scss" scoped>
  @import 'Pagination';
</style>
