<template>
  <div class="table">
    <v-data-table-server
      :page="page"
      :items-per-page="itemsPerPage"
      :items="items"
      :items-length="itemsLength"
      :headers="headers"
      :loading="loading"
      loading-text="Загрузка"
      no-results-text="Ничего не найдено"
      no-data-text="Данных нет"
      @update:page="(val) => emit('update:page', val)"
      @update:items-per-page="(val) => emit('update:itemsPerPage', val)"
      @update:options="onUpdateOptions"
    >
      <template #item.link="{ item }">
        <a :href="item.link" target="_blank">{{ item.link }}</a>
      </template>

      <template #footer.prepend>
        <div class="table__items-per-page">
          <v-select
            :items="[5, 10, 25, 50, 100]"
            :model-value="itemsPerPage"
            label=""
            @update:model-value="(val) => emit('update:itemsPerPage', val)"
            variant="outlined"
            hide-details
          />
        </div>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup>
  const props = defineProps({
    page: {
      type: Number,
      require: true,
    },
    itemsPerPage: {
      type: Number,
      required: true,
    },
    itemsLength: {
      type: Number,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    onUpdateOptions: {
      type: Function,
      required: true,
    },
  });

  const emit = defineEmits(['update:page', 'update:itemsPerPage', 'update:items']);
</script>

<style lang="scss" scoped>
  @import 'Table';
</style>
