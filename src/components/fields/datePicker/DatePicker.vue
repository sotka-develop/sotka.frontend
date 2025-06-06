<template>
  <div class="date-picker">
    <v-date-input
      variant="outlined"
      prepend-icon=""
      append-inner-icon="mdi-calendar"
      :disabled="disabled"
      v-bind="inputProps"
      :model-value="modelValue"
      @update:modelValue="emitUpdate"
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
    modelValue: {
      type: [String, Date],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
    },
    errorMessages: {
      type: Array,
      default: () => [],
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: Boolean,
    },
    min: {
      type: String,
    },
    max: {
      type: String,
    },
    textFieldProps: {
      type: Object,
      default: () => ({}),
    },
  });

  const emit = defineEmits(['update:modelValue']);

  function emitUpdate(val) {
    emit('update:modelValue', val);
  }

  const inputProps = computed(() => ({
    label: props.label,
    placeholder: props.placeholder,
    readonly: props.readonly,
    rules: props.rules,
    errorMessages: props.errorMessages,
    clearable: props.clearable,
    min: props.min,
    max: props.max,
    hideDetails: props.hideDetails,
    ...props.textFieldProps,
  }));
</script>

<style lang="scss" scoped>
  @import 'DatePicker';
</style>
