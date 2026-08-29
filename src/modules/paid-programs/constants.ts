import { PaidProgramCategory, PurchaseFilter } from './types';

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

/** Order of the history filter chips — everything first, then the catalogue tabs. */
export const PURCHASE_FILTERS: readonly PurchaseFilter[] = [
  'ALL',
  ...PAID_PROGRAM_CATEGORIES,
] as const;

/** The catalogue's own labels, so a filter reads exactly like the tab it mirrors. */
export const PURCHASE_FILTER_LABEL_KEYS: Record<PurchaseFilter, string> = {
  ALL: 'paidPrograms:history.filters.all',
  ...CATEGORY_LABEL_KEYS,
};
