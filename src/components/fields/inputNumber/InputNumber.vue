<template>
  <div class="input-number">
    <v-number-input
      variant="outlined"
      v-bind="inputProps"
      :model-value="modelValue"
      :precision="precision"
      :disabled="disabled"
      @update:modelValue="emitUpdate"
    />
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue';

  const props = defineProps({
    label: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    placeholder: {
      type: String,
    },
    modelValue: {
      type: [String, Number],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    errorMessages: {
      type: Array,
      default: () => [],
    },
    min: {
      type: String,
    },
    max: {
      type: String,
    },
    step: {
      type: Number,
      default: 1,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    controlVariant: {
      type: String,
      default: 'hidden',
    },
    hideDetails: {
      type: Boolean,
    },
    textFieldProps: {
      type: Object,
      default: () => ({}),
    },
    precision: {
      type: [Number, String],
      default: null,
    },
    onInput: Function,
  });

  const emit = defineEmits(['update:modelValue']);

  function emitUpdate(val) {
    emit('update:modelValue', val);

    if (props.onInput) {
      props.onInput(val);
    }
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
    step: props.step,
    'control-variant': props.controlVariant,
    hideDetails: props.hideDetails,
    ...props.textFieldProps,
  }));
</script>

<style lang="scss" scoped>
  @import 'InputNumber';
</style>
