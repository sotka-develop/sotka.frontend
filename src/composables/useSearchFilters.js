import { computed } from 'vue';

export default function useSearchFilters(models) {
  return computed(() => ({
    bidd_end_time_from: formatDate(models.biddEndTimeFromModel),
    bidd_end_time_to: formatDate(models.biddEndTimeToModel),
    added_at: formatDate(models.addedAtModel),
    bidd_form: models.biddModel.value || null,
    region_ids: models.regionsModel.value || null,
    etp_codes: models.codesModel.value || null,
    cadaster_number: models.cadasterNumberModel.value?.toString() || null,
    lot: models.lotModel.value || null,
    compositions: models.compositionModel.value || null,
    rubric_ids: models.rubricsModel.value || null,
    categories: models.categoryModel.value || null,
    permitted_uses_id: models.usesModel.value || null,
    price_min_from: models.priceMinFromModel.value || null,
    price_min_to: models.priceMaxFromModel.value || null,
    cadastral_cost_from: models.cadastralCostFromModel.value || null,
    cadastral_cost_to: models.cadastralCostToModel.value || null,
    price_min_cadastral_cost_ratio_percent_from: models.priceMinCadastralCostRatioPercentFromModel.value || null,
    price_min_cadastral_cost_ratio_percent_to: models.priceMinCadastralCostRatioPercentToModel.value || null,
    area_from: models.areaFromModel.value || null,
    area_to: models.areaToModel.value || null,
    page: models.page.value,
    page_size: models.pageSize.value,
  }));
}

function formatDate(model) {
  if (!model.value) return null;

  return new Date(model.value).toISOString().slice(0, 10);
}
