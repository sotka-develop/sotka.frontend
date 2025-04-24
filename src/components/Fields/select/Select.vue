<template>
  <div class="select">
    <v-select
      variant="outlined"
      :label="label"
      :placeholder="placeholder"
      :items="items"
      :model-value="modelValue"
      :multiple="multiple"
      :readonly="readonly"
      :item-title="itemTitle"
      :item-value="itemValue"
      :rules="rules"
      :hide-details="hideDetails"
      :return-object="returnObject"
      :error-messages="errorMessages"
      @update:modelValue="emitUpdate"
    ></v-select>
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
    items: {
      type: Array,
    },
    modelValue: {
      type: [String, Number, Object, Array],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: Boolean,
    },
    multiple: {
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
    returnObject: {
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
  });

  const emit = defineEmits(['update:modelValue']);

  function emitUpdate(val) {
    emit('update:modelValue', val);
  }
</script>

<style lang="scss" scoped>
  @import 'Select';
</style>
