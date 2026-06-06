export const DOCUMENT_TYPES = {
  fiscalReceipt: 'Фискальный чек',
  idCard: 'Удостоверение личности',
  birthCertificate: 'Свидетельство о рождении',
  invoice: 'Счет-фактура на оплату услуг',
  salesReceipt: 'Товарный чек',
  consultativeOpinion: 'Консультативное заключение (направление)',
  medicalHistoryExtract: 'Выписка из истории болезни',
  dentalWorkOrder: 'Стоматологический заказ-наряд',
  studyResults: 'Результаты исследований',
  ibanReference: 'Справка о номере счета получателя IBAN',
} as const;

export type DocumentTypeKey = keyof typeof DOCUMENT_TYPES;

export const documentTypes: { value: string; labelKey: string }[] = (
  Object.keys(DOCUMENT_TYPES) as DocumentTypeKey[]
).map(key => ({
  value: DOCUMENT_TYPES[key],
  labelKey: `compensation:documents.${key}`,
}));

const VALUE_TO_LABEL_KEY: Record<string, string> = Object.fromEntries(
  documentTypes.map(item => [item.value, item.labelKey]),
);

export const getDocumentTypeLabelKey = (value: string): string | undefined =>
  VALUE_TO_LABEL_KEY[value];

export const REQUIRED_DOCUMENT_TYPES: string[] = [
  DOCUMENT_TYPES.fiscalReceipt,
  DOCUMENT_TYPES.idCard,
  DOCUMENT_TYPES.ibanReference,
  DOCUMENT_TYPES.consultativeOpinion,
];

export const DENTAL_WORK_ORDER_TYPE = DOCUMENT_TYPES.dentalWorkOrder;
