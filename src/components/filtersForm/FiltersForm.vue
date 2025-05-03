<template>
  <div class="filters-form">
    <div class="filters-form__content">
      <div v-for="(field, idx) in fields" :key="idx" class="filters-form__field">
        <Field v-bind="field" v-model="field.model" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import Field from '@/components/fields/field/Field.vue';

  import { useFiltersStore } from '@/stores/filters';
  const filtersStore = useFiltersStore();

  const fields = filtersStore.fieldsData || [];
</script>

<style lang="scss" scoped>
  @import 'FiltersForm';
</style>
