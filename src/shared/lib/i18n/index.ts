export {
  FALLBACK_LANGUAGE,
  LANGUAGE_FLAGS,
  LANGUAGE_LABELS,
  LANGUAGE_SHORT_LABELS,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
} from './constants';
export type { SupportedLanguage } from './constants';
export { i18n } from './i18n';
export { LanguageGate } from './language-gate';
export { useLanguage } from './use-language';
export { useTranslation, Trans } from 'react-i18next';
