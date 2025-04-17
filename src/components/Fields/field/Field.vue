<template>
  <div class="field">
    <component :is="componentType" v-bind="passProps" v-model="modelValue" />
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  import Input from '@/components/fields/input/Input.vue';
  import Select from '@/components/fields/select/Select.vue';

  const props = defineProps({
    type: {
      type: String,
      default: 'text',
    },
    modelValue: [String, Number, Boolean, Array, Object],
    rules: {
      type: Array,
      default: () => [],
    },
    readonly: {
      type: Boolean,
    },
    label: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    options: {
      type: Array,
      default: () => [],
    },
    errorMessages: {
      type: Array,
      default: () => [],
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const componentType = computed(() => {
    switch (props.type) {
      case 'select':
        return Select;
      default:
        return Input;
    }
  });

  const passProps = computed(() => ({
    label: props.label,
    placeholder: props.placeholder,
    type: props.type,
    readonly: props.readonly,
    rules: props.rules,
    options: props.options,
    errorMessages: props.errorMessages,
  }));

  const modelValue = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  });
</script>

<style lang="scss" scoped>
  @import 'Field';
</style>
