<template>
  <div class="treeselect" :class="classList">
    <Treeselect
      v-model="selected"
      :options="transformedOptions"
      :multiple="multiple"
      :clearable="clearable"
      :placeholder="placeholder"
      :searchable="true"
      :disabled="disabled"
      :noResultsText="noResultText"
      value-consists-of="LEAF_PRIORITY"
      @input="handleInput"
    >
      <template #no-results-options-tip>
        <div class="treeselect__no-result">{{ noResultText }}</div>
      </template>

      <template #value-label="{ node }">
        <div v-if="selectedCount" class="treeselect__item" :class="{ 'treeselect__item--first': node.id === firstSelectedId }">
          <span class="treeselect__counter">{{ selectedCount }}</span>
        </div>
      </template>

      <!-- <template #value-label="{ node }">
        <div
          class="treeselect__item"
          :class="{ 'treeselect__item--first': node.id === firstSelectedId, 'treeselect__item--last': node.id === lastSelectedId }"
        >
          <div class="treeselect__text">{{ node.label }}</div>

          <button v-if="showCounter" type="button" class="treeselect__toggle" @click="toggleShowAll">{{ counterValue }}</button>

          <button v-if="showAll && node.id === lastSelectedId" type="button" class="treeselect__toggle" @click="toggleShowAll">
            {{ hideButtonText }}
          </button>
        </div>
      </template> -->

      <template #option-label="{ node, shouldShowCount, count, labelClassName, countClassName }">
        <label :class="labelClassName">
          <div :title="node.label" class="treeselect__label">{{ node.label }}</div>
        </label>
      </template>
    </Treeselect>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import Treeselect from '@zanmato/vue3-treeselect';

  const props = defineProps({
    placeholder: String,
    disabled: {
      type: Boolean,
    },
    modelValue: {
      type: [Array],
      default: [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    onInput: {
      type: Function,
      default: null,
    },
  });

  const noResultText = 'Ничего не найдено';

  const emit = defineEmits(['update:modelValue']);

  const selected = ref(props.modelValue);

  const transformedOptions = computed(() => transformData(props.items));

  function transformData(data) {
    return data.map((group) => ({
      label: group.name,
      id: `district_${group.id.toString()}`,
      children: group.items.map((item) => ({
        label: item.text,
        id: item.value,
      })),
    }));
  }

  function handleInput(value) {
    if (props.onInput) {
      props.onInput(value);
    }
  }

  const classList = computed(() => {
    return {
      ['treeselect--multiple']: props.multiple,
      ['treeselect--showall']: showAll.value,
    };
  });

  const firstSelectedId = computed(() => {
    if (!selected.value || !selected.value.length) return null;

    return selected.value[0];
  });

  const lastSelectedId = computed(() => {
    if (!selected.value || !selected.value.length) return null;

    return selected.value[selected.value.length - 1];
  });

  const counterValue = computed(() => {
    if (!selected.value || selected.value.length < 2) return null;

    return `+${selected.value.length - 1}`;
  });

  const selectedCount = computed(() => {
    if (!selected.value || selected.value.length === 0) return 0;

    return `Выбрано (${selected.value.length})`;
  });

  const showCounter = computed(() => {
    return !showAll.value && counterValue.value;
  });

  const hideButtonText = 'Свернуть';

  const showAll = ref(false);

  function toggleShowAll() {
    showAll.value = !showAll.value;
  }

  watch(selected, (newValue) => {
    emit('update:modelValue', newValue);
  });

  watch(
    () => props.modelValue,
    (newValue) => {
      selected.value = newValue;
    }
  );
</script>

<style lang="scss" scoped>
  @import 'TreeSelect';
</style>
