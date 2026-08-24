import { PaidProgramCategory } from './types';

export const PAID_PROGRAM_CATEGORIES: readonly PaidProgramCategory[] = [
  'MED_PLAN',
  'CHECKUP',
] as const;

/** i18n keys for the segmented control, keyed by category. */
export const CATEGORY_LABEL_KEYS: Record<PaidProgramCategory, string> = {
  MED_PLAN: 'paidPrograms:categories.medPlan',
  CHECKUP: 'paidPrograms:categories.checkup',
};

/** i18n keys for the short explainer under the segmented control. */
export const CATEGORY_HINT_KEYS: Record<PaidProgramCategory, string> = {
  MED_PLAN: 'paidPrograms:hints.medPlan',
  CHECKUP: 'paidPrograms:hints.checkup',
};
