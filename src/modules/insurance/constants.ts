import { CompensationCategoryEnum, ElectronicReferralStatus } from './types';

export const INSURANCE_CERTIFICATE_URL =
  'https://mobileapi.archimedes.kz/v3/certificate/:programId';

export const compensationCategories = [
  {
    id: CompensationCategoryEnum.OutpatientCare,
    titleKey: 'compensation:categories.outpatientCare',
  },
  {
    id: CompensationCategoryEnum.Dentistry,
    titleKey: 'compensation:categories.dentistry',
  },
  {
    id: CompensationCategoryEnum.Medications,
    titleKey: 'compensation:categories.medications',
  },
  {
    id: CompensationCategoryEnum.InpatientTreatment,
    titleKey: 'compensation:categories.inpatientTreatment',
  },
];

export const REFERRAL_OPTIONS = [
  { id: ElectronicReferralStatus.NOT_RECEIVED, label: 'Услуга не получена' },
  { id: ElectronicReferralStatus.RECEIVED, label: 'Услуга получена' },
  { id: ElectronicReferralStatus.DECLINED, label: 'Отказ от услуги' },
] as const;
