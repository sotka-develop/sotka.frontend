function formatCadastralRatio(value) {
  if (value == null || value === '') return '-';
  return Number(value) === 0 ? '<1' : value || '-';
}

export function preparePointData(data) {
  return {
    cadaster_number: data?.cadaster_number || '-',
    latitude: data?.coords?.latitude,
    longitude: data?.coords?.longitude,
    bidd_form: data?.bidd_form?.bidd_form || '-',
    type_transaction_rus: data?.type_transaction_rus || '-',
    category_from_nspd: data?.category_from_nspd || '-',
    permitted_use_established_by_document_from_nspd: data?.permitted_use_established_by_document_from_nspd || '-',
    price_min_in_rub: data?.price_min_in_rub || '-',
    cadastral_cost_from_nspd_in_rub: data?.cadastral_cost_from_nspd_in_rub || '-',
    price_min_cadastral_cost_ratio_percent: formatCadastralRatio(data?.price_min_cadastral_cost_ratio_percent),
    bidd_end_time: data?.bidd_end_time || '-',
    auction_start_date: data?.auction_start_date || '-',
    etp_code: data?.etp_code?.etp_code || '-',
    link: data?.link || '-',
    category_purpose_or_category_from_torgigov_processed: data?.category_purpose_or_category_from_torgigov_processed || '-',
    permitted_use: data?.permitted_use || '-',
    area: data?.area || '-',
  };
}
