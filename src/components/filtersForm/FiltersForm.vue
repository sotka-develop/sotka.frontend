<template>
  <div class="filters-form">
    <Loader v-if="filtersReadyLoading" size="small" />

    <div v-else class="filters-form__content">
      <template v-for="(field, idx) in fields" :key="idx">
        <div v-if="field.split" class="filters-form__split">
          <p class="h5">{{ field.split }}</p>
        </div>
        <div v-else class="filters-form__field" :class="{ 'filters-form__field--fill': field.fill }">
          <template v-if="!field.disabled">
            <Field v-bind="field" v-model="field.model" />
          </template>

          <template v-else>
            <Field
              v-bind="{
                ...field,
                tooltip: {
                  icon: '20/lock',
                  text: `${field.label} не доступно на вашем <a href='https://s0tka.ru/price' target='_blank'>Тарифе</a>`,
                  interactive: true,
                },
              }"
              v-model="field.model"
            />
          </template>
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
  import { onMounted } from 'vue';

  const filtersStore = useFiltersStore();
  const { filtersReadyLoading } = storeToRefs(filtersStore);

  const fields = filtersStore.fieldsData || [];

  onMounted(() => {
    setTimeout(() => {
      console.log(fields);
    }, 200);
  });
</script>

<style lang="scss" scoped>
  @import 'FiltersForm';
</style>
