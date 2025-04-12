<template>
  <main>
    <div class="container">
      <h2>Лоты</h2>

      <div class="form-filters">
        <div class="form-filters__items form-filters__items--4">
          <!-- Окончательная подача заявок от -->
          <div class="form-filters__item">
            <VDateInput label="Окончательная подача заявок от" v-model="biddEndTimeFromModel" placeholder="Выбрать значение" />
          </div>

          <!-- Окончательная подача заявок до -->
          <div class="form-filters__item">
            <VDateInput label="Окончательная подача заявок до" v-model="biddEndTimeToModel" placeholder="Выбрать значение" />
          </div>

          <!-- Процедура / Форма торгов -->
          <div class="form-filters__item">
            <v-select
              label="Процедура"
              placeholder="Выбрать значение"
              v-model="biddModel"
              :items="biddData"
              multiple
              item-title="text"
              item-value="value"
            ></v-select>
          </div>

          <!-- Локация / Регион -->
          <div class="form-filters__item">
            <v-select
              label="Локация"
              placeholder="Регион, область, город"
              v-model="regionsModel"
              multiple
              item-title="text"
              item-value="value"
              :items="regionsData"
            />
          </div>

          <!-- Электронная площадка / Код ЭТП -->
          <div class="form-filters__item">
            {{ codesModel }}
            <v-select
              label="Электронная площадка"
              placeholder="Выбрать значение"
              item-title="text"
              item-value="value"
              v-model="codesModel"
              :items="codesData"
              multiple
            ></v-select>
          </div>

          <!-- Кадастровый номер -->
          <div class="form-filters__item">
            <v-number-input
              v-model="cadasterNumberModel"
              :reverse="false"
              controlVariant="default"
              label="Кадастровый номер"
              :hideInput="false"
              :inset="false"
              multiple
              placeholder="Например, 1111"
            ></v-number-input>
          </div>

          <!-- Извещение, лот -->
          <div class="form-filters__item">
            <v-text-field label="Извещение, лот" v-model="lotModel" placeholder="Например, 1111"></v-text-field>
          </div>

          <!-- Составность / Композиция -->
          <div class="form-filters__item">
            <v-select
              label="Составность"
              placeholder="Выбрать значение"
              v-model="compositionModel"
              :items="compositionData"
              item-title="text"
              item-value="value"
              multiple
            ></v-select>
          </div>

          <!-- Добавлено / Дата добавления -->
          <div class="form-filters__item">
            <VDateInput label="Добавлено" v-model="addedAtModel" placeholder="Выбрать значение" />
          </div>

          <!-- Рубрики -->
          <div class="form-filters__item">
            <v-select
              label="Рубрики"
              placeholder="Выбрать значение"
              item-title="text"
              item-value="value"
              multiple
              v-model="rubricsModel"
              :items="rubricsData"
            ></v-select>
          </div>

          <!-- Категория ЗУ -->
          <div class="form-filters__item">
            <v-select
              label="Категория ЗУ"
              placeholder="Выбрать значение"
              v-model="categoryModel"
              item-title="text"
              item-value="value"
              multiple
              :items="categoryData"
            ></v-select>
          </div>
        </div>

        <div class="form-filters__items form-filters__items--1">
          <!-- ВРИ / Разрешенные использования -->
          <div class="form-filters__item">
            <v-select
              label="ВРИ"
              placeholder="Выбрать значение"
              item-title="text"
              item-value="value"
              multiple
              v-model="usesModel"
              :items="usesData"
            ></v-select>
          </div>
        </div>

        <div class="form-filters__items form-filters__items--4">
          <!-- Начальная цена, ₽ (более) / Минимальная цена от -->
          <div class="form-filters__item">
            <v-number-input
              :reverse="false"
              controlVariant="default"
              label="Начальная цена, ₽ (более)"
              :hideInput="false"
              :inset="false"
              placeholder=""
              v-model="priceMinFromModel"
            ></v-number-input>
          </div>

          <!-- Начальная цена, ₽ (менее) / Минимальная цена до -->
          <div class="form-filters__item">
            <v-number-input
              :reverse="false"
              controlVariant="default"
              label="Начальная цена, ₽ (менее)"
              :hideInput="false"
              :inset="false"
              placeholder=""
              v-model="priceMaxFromModel"
            ></v-number-input>
          </div>

          <!-- Кадастровая стоимость от -->
          <div class="form-filters__item">
            <v-number-input
              :reverse="false"
              controlVariant="default"
              label="Кадастровая стоимость от"
              :hideInput="false"
              :inset="false"
              placeholder=""
              v-model="cadastralCostFromModel"
            ></v-number-input>
          </div>

          <!-- Кадастровая стоимость до -->
          <div class="form-filters__item">
            <v-number-input
              :reverse="false"
              controlVariant="default"
              label="Кадастровая стоимость до"
              :hideInput="false"
              :inset="false"
              placeholder=""
              v-model="cadastralCostToModel"
            ></v-number-input>
          </div>

          <!-- % соотн. нач.ц. и кад.ст от -->
          <div class="form-filters__item">
            <v-number-input
              :reverse="false"
              controlVariant="default"
              label="% соотн. нач.ц. и кад.ст от"
              :hideInput="false"
              :inset="false"
              placeholder=""
              v-model="priceMinCadastralCostRatioPercentFromModel"
            ></v-number-input>
          </div>

          <!-- % соотн. нач.ц. и кад.ст до -->
          <div class="form-filters__item">
            <v-number-input
              :reverse="false"
              controlVariant="default"
              label="% соотн. нач.ц. и кад.ст до"
              :hideInput="false"
              :inset="false"
              placeholder=""
              v-model="priceMinCadastralCostRatioPercentToModel"
            ></v-number-input>
          </div>

          <!-- Площадь от -->
          <div class="form-filters__item">
            <v-number-input
              :reverse="false"
              controlVariant="default"
              label="Площадь от"
              :hideInput="false"
              :inset="false"
              placeholder=""
              v-model="areaFromModel"
            ></v-number-input>
          </div>

          <!-- Площадь до -->
          <div class="form-filters__item">
            <v-number-input
              :reverse="false"
              controlVariant="default"
              label="Площадь до"
              :hideInput="false"
              :inset="false"
              placeholder=""
              v-model="areaToModel"
            ></v-number-input>
          </div>
        </div>

        <div class="form-filters__action">
          <Button text="Поиск" @click="onSearch" />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { useFiltersStore } from '@/stores/filters';
  import { useLotsStore } from '@/stores/lots';
  import Button from '@/components/Button/Button.vue';

  // store
  const filtersStore = useFiltersStore();
  const lotsStore = useLotsStore();

  // Окончательная подача заявок от
  const biddEndTimeFromModel = ref(null);
  // Окончательная подача заявок до
  const biddEndTimeToModel = ref(null);

  // Форма торгов
  const biddModel = ref(null);
  const biddData = computed(() => {
    return filtersStore.bidd_forms;
  });

  // Локация / Регион
  const regionsModel = ref(null);
  const regionsData = computed(() => {
    return filtersStore.regions;
  });

  // Электронная площадка / Код ЭТП
  const codesModel = ref(null);
  const codesData = computed(() => {
    return filtersStore.etp_codes;
  });

  // Кадастровый номер
  const cadasterNumberModel = ref(null);

  // Лот
  const lotModel = ref(null);

  // Композиция
  const compositionModel = ref(null);
  const compositionData = ref([
    {
      text: 'Кадастровый номер',
      value: 1,
    },
    {
      text: 'Кадастровый квартал',
      value: 2,
    },
    {
      text: 'Кадастровый район',
      value: 3,
    },
    {
      text: 'Координаты не определены',
      value: 4,
    },
  ]);

  // Дата добавления
  const addedAtModel = ref(null);

  // Рубрики
  const rubricsModel = ref(null);
  const rubricsData = computed(() => {
    return filtersStore.rubrics;
  });

  // Категория ЗУ
  const categoryModel = ref(null);
  const categoryData = computed(() => {
    return filtersStore.categories;
  });

  // ВРИ / Разрешенные использования
  const usesModel = ref(null);
  const usesData = computed(() => {
    return filtersStore.permitted_uses;
  });

  // Начальная цена, ₽ (более) / Минимальная цена от
  const priceMinFromModel = ref(null);

  // Начальная цена, ₽ (менее) / Минимальная цена до
  const priceMaxFromModel = ref(null);

  // Кадастровая стоимость от
  const cadastralCostFromModel = ref(null);

  // Кадастровая стоимость до
  const cadastralCostToModel = ref(null);

  //  % соотн. нач.ц. и кад.ст от
  const priceMinCadastralCostRatioPercentFromModel = ref(null);

  //  % соотн. нач.ц. и кад.ст до
  const priceMinCadastralCostRatioPercentToModel = ref(null);

  // Площадь от
  const areaFromModel = ref(null);
  // Площадь до
  const areaToModel = ref(null);

  async function onSearch() {
    const filters = {
      bidd_end_time_from: biddEndTimeFromModel.value,
      bidd_end_time_to: biddEndTimeToModel.value,
      bidd_form: biddModel.value,
      region_ids: regionsModel.value,
      etp_codes: codesModel.value,
      cadaster_number: cadasterNumberModel.value || null,
      lot: lotModel.value || null,
      compositions: compositionModel.value,
      added_at: addedAtModel.value || null,
      rubric_ids: rubricsModel.value,
      categories: categoryModel.value,
      permitted_uses_id: usesModel.value,
      price_min_from: priceMinFromModel.value || null,
      price_min_to: priceMaxFromModel.value || null,
      cadastral_cost_from: cadastralCostFromModel.value || null,
      cadastral_cost_to: cadastralCostToModel.value || null,
      price_min_cadastral_cost_ratio_percent_from: priceMinCadastralCostRatioPercentFromModel.value || null,
      price_min_cadastral_cost_ratio_percent_to: priceMinCadastralCostRatioPercentToModel.value || null,
      area_from: areaFromModel.value || null,
      area_to: areaToModel.value || null,
      page: 0,
      page_size: '10',
    };

    await lotsStore.fetchLots(filters);
  }

  onMounted(async () => {
    await filtersStore.loadFilters();
  });
</script>

<style lang="scss" scoped>
  // TODO временно

  .form-filters {
    &__items {
      display: grid;
      gap: 24px 28px;

      &--1 {
        grid-template-columns: 1fr;
      }

      &--3 {
        grid-template-columns: 1fr 1fr 2fr;
      }

      &--4 {
        grid-template-columns: 1fr 1fr 1fr 1fr;
      }

      &:not(:last-child) {
        margin-bottom: 28px;
      }
    }
  }
</style>
