<template>
  <div class="input">
    <v-text-field
      variant="outlined"
      :label="label"
      :placeholder="placeholder"
      :type="type"
      :model-value="modelValue"
      :readonly="readonly"
      :rules="rules"
      :disabled="disabled"
      :hide-details="hideDetails"
      :error-messages="errorMessages"
      @update:modelValue="emitUpdate"
    ></v-text-field>
  </div>
</template>

<script setup>
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
    type: {
      type: String,
      default: 'text',
    },
    modelValue: {
      type: [String, Number],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: Boolean,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    errorMessages: {
      type: Array,
      default: () => [],
    },
  });

  const emit = defineEmits(['update:modelValue']);

  function emitUpdate(val) {
    emit('update:modelValue', val);
  }
</script>

<style lang="scss" scoped>
  @import 'Input';
</style>
