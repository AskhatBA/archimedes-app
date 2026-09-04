import { FALLBACK_LANGUAGE, SupportedLanguage } from '@/shared/lib/i18n';

/**
 * Public offer agreement a paid patient accepts before paying for a visit.
 * One document per interface language.
 */
export const PUBLIC_OFFER_FILES: Record<SupportedLanguage, string> = {
  ru: 'https://mis.archimedes.kz/mobile-app/v1/api/static/documents/offer-ru.docx',
  kk: 'https://mis.archimedes.kz/mobile-app/v1/api/static/documents/offer-kk.docx',
  en: 'https://mis.archimedes.kz/mobile-app/v1/api/static/documents/offer-en.docx',
};

export const publicOfferFileFor = (language: string): string =>
  PUBLIC_OFFER_FILES[language as SupportedLanguage] ||
  PUBLIC_OFFER_FILES[FALLBACK_LANGUAGE];
