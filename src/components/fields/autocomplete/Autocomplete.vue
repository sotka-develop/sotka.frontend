<template>
  <div class="autocomplete">
    <v-autocomplete
      variant="outlined"
      v-bind="inputProps"
      :model-value="modelValue"
      :items="items"
      @update:modelValue="emitUpdate"
      @input="handleInput"
    />
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    label: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    items: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: [String, Number, Object, Array],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: Boolean,
    },
    returnObject: {
      type: Boolean,
      default: false,
    },
    itemTitle: {
      type: String,
      default: 'text',
    },
    itemValue: {
      type: String,
      default: 'value',
    },
    rules: {
      type: Array,
      default: () => [],
    },
    errorMessages: {
      type: Array,
      default: () => [],
    },
    onInput: Function,
  });

  const emit = defineEmits(['update:modelValue']);

  function emitUpdate(val) {
    emit('update:modelValue', val);
  }

  function handleInput(val) {
    if (props.onInput) {
      props.onInput(val);
    }
  }

  const inputProps = computed(() => ({
    label: props.label,
    placeholder: props.placeholder,
    readonly: props.readonly,
    multiple: props.multiple,
    returnObject: props.returnObject,
    itemTitle: props.itemTitle,
    itemValue: props.itemValue,
    rules: props.rules,
    hideDetails: props.hideDetails,
    errorMessages: props.errorMessages,
  }));
</script>

<style lang="scss" scoped>
  @import 'Autocomplete';
</style>
