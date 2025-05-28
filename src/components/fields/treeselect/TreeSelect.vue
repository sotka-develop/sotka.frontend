<template>
  <div class="treeselect">
    <Treeselect
      v-model="selected"
      :options="transformedOptions"
      :multiple="multiple"
      :clearable="clearable"
      :placeholder="placeholder"
      :searchable="true"
      :noResultsText="noResultText"
      value-consists-of="LEAF_PRIORITY"
      @input="handleInput"
    >
      <template #no-results-options-tip="{ node, shouldShowCount, count, labelClassName, countClassName }">
        <div class="treeselect__no-result">{{ noResultText }}</div>
      </template>
    </Treeselect>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import Treeselect from '@zanmato/vue3-treeselect';

  const props = defineProps({
    placeholder: String,
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
