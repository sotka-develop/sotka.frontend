<template>
  <div class="field">
    <label v-if="label" class="field__label text-lead">{{ label }}</label>

    <component :is="componentType" v-bind="passProps" v-model="modelValue" />
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  import Input from '@/components/fields/input/Input.vue';
  import Select from '@/components/fields/select/Select.vue';
  import DatePicker from '@/components/fields/datePicker/DatePicker.vue';
  import InputNumber from '@/components/fields/inputNumber/InputNumber.vue';
  import Autocomplete from '@/components/fields/autocomplete/Autocomplete.vue';

  const props = defineProps({
    type: {
      type: String,
      default: 'text',
    },
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
      type: [String, Number, Boolean, Array, Object],
    },
    readonly: {
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
    hideDetails: {
      type: Boolean,
      default: false,
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
    min: {
      type: [String, Number],
    },
    max: {
      type: [String, Number],
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    step: {
      type: Number,
      default: 1,
    },
    controlVariant: {
      type: String,
      default: 'hidden',
    },
    textFieldProps: {
      type: Object,
      default: () => ({}),
    },
    precision: {
      type: [Number, String],
      default: () => null,
    },
    onInput: Function,
  });

  const emit = defineEmits(['update:modelValue']);

  const componentType = computed(() => {
    switch (props.type) {
      case 'select':
        return Select;
      case 'date':
        return DatePicker;
      case 'number':
        return InputNumber;
      case 'autocomplete':
        return Autocomplete;
      default:
        return Input;
    }
  });

  const passProps = computed(() => {
    const baseProps = {
      // label: props.label,
      placeholder: props.placeholder,
      type: props.type,
      readonly: props.readonly,
      rules: props.rules,
      errorMessages: props.errorMessages,
      hideDetails: props.hideDetails,
    };

    if (props.type === 'select') {
      return {
        ...baseProps,
        items: props.items,
        multiple: props.multiple,
        returnObject: props.returnObject,
        itemTitle: props.itemTitle,
        itemValue: props.itemValue,
      };
    }

    if (props.type === 'date') {
      return {
        // label: props.label,
        placeholder: props.placeholder,
        readonly: props.readonly,
        rules: props.rules,
        errorMessages: props.errorMessages,
        clearable: props.clearable,
        min: props.min,
        max: props.max,
        textFieldProps: props.textFieldProps,
        hideDetails: props.hideDetails,
      };
    }

    if (props.type === 'number') {
      return {
        // label: props.label,
        placeholder: props.placeholder,
        readonly: props.readonly,
        rules: props.rules,
        errorMessages: props.errorMessages,
        min: props.min,
        max: props.max,
        step: props.step,
        clearable: props.clearable,
        controlVariant: props.controlVariant,
        textFieldProps: props.textFieldProps,
        hideDetails: props.hideDetails,
        precision: props.precision,
      };
    }

    if (props.type === 'autocomplete') {
      return {
        // label: props.label,
        placeholder: props.placeholder,
        readonly: props.readonly,
        items: props.items,
        rules: props.rules,
        errorMessages: props.errorMessages,
        multiple: props.multiple,
        returnObject: props.returnObject,
        itemTitle: props.itemTitle,
        itemValue: props.itemValue,
        hideDetails: props.hideDetails,
        onInput: props.onInput,
      };
    }

    return baseProps;
  });

  const modelValue = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  });
</script>

<style lang="scss" scoped>
  @import 'Field';
</style>
