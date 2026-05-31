import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import {
  DEFAULT_NAMESPACE,
  FALLBACK_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from './constants';
import { languageDetector } from './language-detector';
import en from './locales/en.json';
import kk from './locales/kk.json';
import ru from './locales/ru.json';

export const resources = {
  kk,
  ru,
  en,
} as const;

if (!i18n.isInitialized) {
  i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: FALLBACK_LANGUAGE,
      supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
      defaultNS: DEFAULT_NAMESPACE,
      ns: ['common', 'errors', 'tabs', 'auth', 'language'],
      interpolation: {
        escapeValue: false,
      },
      returnNull: false,
      compatibilityJSON: 'v4',
      react: {
        useSuspense: false,
      },
    });
}

export { i18n };
