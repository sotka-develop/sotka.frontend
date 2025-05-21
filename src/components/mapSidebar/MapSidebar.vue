<template>
  <div class="map-sidebar">
    <SimpleBar class="map-sidebar__bar" data-simplebar-auto-hide="false">
      <div class="map-sidebar__content">
        <p v-if="title" class="map-sidebar__title h5">{{ title }}</p>

        <p class="map-sidebar__subtitle text-lead">{{ subtitle }}</p>

        <ul class="map-sidebar__list">
          <li v-for="(item, idx) in information" :key="idx" class="map-sidebar__item">
            <span class="map-sidebar__text text-small">{{ item.text }}</span>

            <template v-if="item.href && item.value">
              <a :href="item.href" class="map-sidebar__link" target="_blank">{{ item.value }}</a>
            </template>

            <template v-else-if="item.value">
              <span class="map-sidebar__value" :title="item.value">{{ item.value }}</span>
            </template>
          </li>
        </ul>
      </div>
    </SimpleBar>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    data: {
      type: Object,
    },
  });

  const title = computed(() => {
    if (!props?.data?.cadasterNumber) return '';

    return `Кадастровый номер: ${props.data.cadasterNumber}`;
  });

  const subtitle = 'Информация';

  const information = computed(() => {
    if (!props.data) return [];

    return [
      {
        text: 'Кадастровый номер',
        value: props?.data?.cadasterNumber || '-',
      },
      {
        text: 'Координаты',
        value: `${props?.data?.latitude || '-'}, ${props?.data?.longitude || '-'}`,
      },
      {
        text: 'Форма проведения',
        value: props?.data?.biddFormRaw || '-',
      },
      {
        text: 'Вид сделки',
        value: props?.data?.typeTransactionRus || '-',
      },
      {
        text: 'Категория {КН}',
        value: props?.data?.categoryFromNspd || '-',
      },
      {
        text: 'ВРИ {КН}',
        value: props?.data?.permittedUseEstablishedByDocumentFromNspd || '-',
      },
      {
        text: 'Площадь {КН}',
        value: props?.data?.area || '-',
      },
      {
        text: 'Начальная цена',
        value: props?.data?.priceMinInRub || '-',
      },
      {
        text: 'Кадастровая стоимость',
        value: props?.data?.cadastralCostFromNspdInRub || '-',
      },
      {
        text: '% соот. НЦ и КС',
        value: props?.data?.priceMinCadastralCostRatioPercent || '-',
      },
      {
        text: 'Оконч.подач.заяв.',
        value: props?.data?.biddEndTime || '-',
      },
      {
        text: 'Дата проведения торгов',
        value: props?.data?.auctionStartDate || '-',
      },
      {
        text: 'ЭТП',
        value: props?.data?.etpCode || '-',
      },
      {
        text: 'Ссылка',
        href: props?.data?.link,
        value: props?.data?.link || '-',
      },
      {
        text: 'Категория {TG}',
        value: props?.data?.categoryPurposeOrCategoryFromTorgigovProcessed,
      },
      {
        text: 'ВРИ {TG}',
        value: props?.data?.permittedUse || '-',
      },
      {
        text: 'Площадь {TG}',
        value: props?.data?.area || '-',
      },
    ];
  });
</script>

<style lang="scss" scoped>
  @import 'MapSidebar';
</style>
