<template>
  <div class="checkbox">
    <v-checkbox
      :label="label"
      :disabled="disabled"
      :readonly="readonly"
      :rules="rules"
      :hide-details="hideDetails"
      :model-value="modelValue"
      :ripple="false"
      @update:modelValue="emitUpdate"
    >
      <template #label>
        <span v-html="label" />
      </template>
    </v-checkbox>
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
    readonly: {
      type: Boolean,
    },
    modelValue: {
      type: [String, Number],
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
  @import 'Checkbox';
</style>
