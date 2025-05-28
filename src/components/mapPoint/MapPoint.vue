<template>
  <div class="map-point">
    <SimpleBar class="map-point__bar" data-simplebar-auto-hide="false">
      <div class="map-point__content">
        <p v-if="title" class="map-point__title h5">{{ title }}</p>

        <p class="map-point__subtitle text-lead">{{ subtitle }}</p>

        <button type="button" class="map-point__pin" v-if="coords" @click="centeringOnPoint">
          <Icon name="24/map-pin" />
        </button>

        <ul class="map-point__list">
          <li v-for="(item, idx) in information" :key="idx" class="map-point__item">
            <span class="map-point__text text-small">{{ item.text }}</span>

            <template v-if="item.href && item.value">
              <a :href="item.href" class="map-point__link" target="_blank">{{ item.value }}</a>
            </template>

            <template v-else-if="item.value">
              <span class="map-point__value" :title="item.value">{{ item.value }}</span>
            </template>
          </li>
        </ul>
      </div>
    </SimpleBar>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import Icon from '@/components/icon/Icon.vue';

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
        value: props?.data?.cadaster_number || '-',
      },
      {
        text: 'Координаты',
        value: `${props?.data?.latitude || '-'}, ${props?.data?.longitude || '-'}`,
      },
      {
        text: 'Форма проведения',
        value: props?.data?.bidd_form || '-',
      },
      {
        text: 'Вид сделки',
        value: props?.data?.type_transaction_rus || '-',
      },
      {
        text: 'Категория {КН}',
        value: props?.data?.category_from_nspd || '-',
      },
      {
        text: 'ВРИ {КН}',
        value: props?.data?.permitted_use_established_by_document_from_nspd || '-',
      },
      {
        text: 'Площадь {КН}',
        value: props?.data?.area || '-',
      },
      {
        text: 'Начальная цена',
        value: props?.data?.price_min_in_rub || '-',
      },
      {
        text: 'Кадастровая стоимость',
        value: props?.data?.cadastral_cost_from_nspd_in_rub || '-',
      },
      {
        text: '% соот. НЦ и КС',
        value: props?.data?.price_min_cadastral_cost_ratio_percent || '-',
      },
      {
        text: 'Оконч.подач.заяв.',
        value: props?.data?.bidd_end_time || '-',
      },
      {
        text: 'Дата проведения торгов',
        value: props?.data?.auction_start_date || '-',
      },
      {
        text: 'ЭТП',
        value: props?.data?.etp_code || '-',
      },
      {
        text: 'Ссылка',
        href: props?.data?.link,
        value: props?.data?.link || '-',
      },
      {
        text: 'Категория {TG}',
        value: props?.data?.category_purpose_or_category_from_torgigov_processed,
      },
      {
        text: 'ВРИ {TG}',
        value: props?.data?.permitted_use || '-',
      },
      {
        text: 'Площадь {TG}',
        value: props?.data?.area || '-',
      },
    ];
  });

  const coords = computed(() => {
    if (!props.data) return null;

    const latitude = props?.data?.latitude;
    const longitude = props?.data?.longitude;

    if (!latitude || !longitude) return null;

    return [longitude, latitude];
  });

  const emit = defineEmits(['centering']);

  function centeringOnPoint() {
    emit('centering', coords.value);
  }
</script>

<style lang="scss" scoped>
  @import 'MapPoint';
</style>
