import { CompensationCategoryEnum } from './types';

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
