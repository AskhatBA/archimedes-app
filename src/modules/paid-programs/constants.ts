import { PaidProgramCategory, PurchaseFilter } from './types';

/** Catalogue order — each category has its own screen; this drives the history filters. */
export const PAID_PROGRAM_CATEGORIES: readonly PaidProgramCategory[] = [
  'MED_PLAN',
  'CHECKUP',
] as const;

/** i18n keys for a category's own name, keyed by category. */
export const CATEGORY_LABEL_KEYS: Record<PaidProgramCategory, string> = {
  MED_PLAN: 'paidPrograms:categories.medPlan',
  CHECKUP: 'paidPrograms:categories.checkup',
};

/** i18n keys for the short explainer at the top of a catalogue screen. */
export const CATEGORY_HINT_KEYS: Record<PaidProgramCategory, string> = {
  MED_PLAN: 'paidPrograms:hints.medPlan',
  CHECKUP: 'paidPrograms:hints.checkup',
};

/** Order of the history filter chips — everything first, then the catalogues. */
export const PURCHASE_FILTERS: readonly PurchaseFilter[] = [
  'ALL',
  ...PAID_PROGRAM_CATEGORIES,
] as const;

/** The catalogues' own labels, so a filter reads exactly like the screen it mirrors. */
export const PURCHASE_FILTER_LABEL_KEYS: Record<PurchaseFilter, string> = {
  ALL: 'paidPrograms:history.filters.all',
  ...CATEGORY_LABEL_KEYS,
};
