<template>
  <div class="form-filters">
    <div class="form-filters__items form-filters__items--4">
      <div v-for="(field, index) in filtersConfig" :key="index" class="form-filters__item">
        <Field v-bind="getFieldProps(field)" v-model="models[field.model]" />
      </div>
    </div>

    <div class="form-filters__action">
      <Button text="Поиск" @click="onSearch" />
    </div>
  </div>
</template>

<script setup>
  import Field from '@/components/fields/field/Field.vue';
  import Button from '@/components/button/Button.vue';

  const props = defineProps({
    filtersConfig: {
      type: Array,
      required: true,
    },
    models: {
      type: Object,
      required: true,
    },
    onSearch: {
      type: Function,
      required: true,
    },
  });

  /**
   * Приведение полей к ожидаемому формату Field
   */
  const getFieldProps = (field) => {
    const { type, label, placeholder, items, multiple, itemTitle, itemValue, returnObject, onInput } = field;

    return {
      type,
      label,
      placeholder,
      items: items ? props[items] : undefined,
      multiple,
      itemTitle,
      itemValue,
      returnObject,
      onInput: onInput ? props[onInput] : undefined,
      hideDetails: true,
    };
  };
</script>
