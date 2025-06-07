<template>
  <div class="filters-form">
    <Loader v-if="filtersReadyLoading" size="small" />

    <div v-else class="filters-form__content">
      <div v-for="(field, idx) in fields" :key="idx" class="filters-form__field">
        <Field v-bind="field" v-model="field.model" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import Loader from '@/components/loader/Loader.vue';
  import Field from '@/components/fields/field/Field.vue';

  import { storeToRefs } from 'pinia';
  import { useFiltersStore } from '@/stores/filters';

  const filtersStore = useFiltersStore();
  const { filtersReadyLoading } = storeToRefs(filtersStore);

  const fields = filtersStore.fieldsData || [];
</script>

<style lang="scss" scoped>
  @import 'FiltersForm';
</style>
