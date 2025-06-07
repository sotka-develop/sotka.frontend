<template>
  <div class="filters-form">
    <Loader v-if="filtersReadyLoading" size="small" />

    <div v-else class="filters-form__content">
      <template v-for="(field, idx) in fields" :key="idx">
        <div v-if="field.split" class="filters-form__split">
          <p class="h5">{{ field.split }}</p>
        </div>
        <div v-else class="filters-form__field">
          <Field v-bind="field" v-model="field.model" />
        </div>
      </template>
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
