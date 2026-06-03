export const LANGUAGE_STORAGE_KEY = '@archimedes/language';

export const DEFAULT_NAMESPACE = 'common';

export const SUPPORTED_LANGUAGES = ['kk', 'ru', 'en'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const FALLBACK_LANGUAGE: SupportedLanguage = 'ru';

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  kk: 'Қазақша',
  ru: 'Русский',
  en: 'English',
};

export const LANGUAGE_SHORT_LABELS: Record<SupportedLanguage, string> = {
  kk: 'KZ',
  ru: 'RU',
  en: 'EN',
};

export const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  kk: '🇰🇿',
  ru: '🇷🇺',
  en: '🇬🇧',
};
