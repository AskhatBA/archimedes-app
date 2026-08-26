import { FALLBACK_LANGUAGE, SupportedLanguage } from '@/shared/lib/i18n';

/**
 * Public offer agreement a paid patient accepts before paying for a visit.
 * One document per interface language.
 */
export const PUBLIC_OFFER_FILES: Record<SupportedLanguage, string> = {
  ru: 'https://drive.google.com/file/d/19Ye3MlvOeoQfe45k0_lSoWBJArqkiH9i/preview',
  kk: 'https://drive.google.com/file/d/1MIPZbZI24ZQPI-febmBK8KXqP_HQKOHA/preview',
  en: 'https://drive.google.com/file/d/12zWe7k9eJI8BnY03LMKTN4QyTFC5N09P/preview',
};

export const publicOfferFileFor = (language: string): string =>
  PUBLIC_OFFER_FILES[language as SupportedLanguage] ||
  PUBLIC_OFFER_FILES[FALLBACK_LANGUAGE];
