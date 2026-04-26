import { CompensationCategoryEnum, ElectronicReferralStatus } from './types';

export const INSURANCE_CERTIFICATE_URL =
  'https://mobileapi.archimedes.kz/v3/certificate/:programId';

export const compensationCategories = [
  {
    id: CompensationCategoryEnum.OutpatientCare,
    title: 'АПП (амбулаторно-поликлиническая помощь)',
  },
  {
    id: CompensationCategoryEnum.Dentistry,
    title: 'Стоматология',
  },
  {
    id: CompensationCategoryEnum.Medications,
    title: 'Медикаменты',
  },
  {
    id: CompensationCategoryEnum.InpatientTreatment,
    title: 'Стационарное лечение',
  },
];

export const REFERRAL_OPTIONS = [
  { id: ElectronicReferralStatus.NOT_RECEIVED, label: 'Услуга не получена' },
  { id: ElectronicReferralStatus.RECEIVED, label: 'Услуга получена' },
  { id: ElectronicReferralStatus.DECLINED, label: 'Отказ от услуги' },
] as const;
