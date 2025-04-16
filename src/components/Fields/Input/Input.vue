<template>
  <div class="input">
    <v-text-field
      variant="outlined"
      :label="label"
      :placeholder="placeholder"
      :type="type"
      :readonly="readonly"
      :model-value="modelValue"
      :rules="rules"
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
    placeholder: {
      type: String,
    },
    type: {
      type: String,
      default: 'text',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    modelValue: [String, Number],
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
