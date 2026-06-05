import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import {
  DEFAULT_NAMESPACE,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from './constants';
import en from './locales/en.json';
import kk from './locales/kk.json';
import ru from './locales/ru.json';

export const resources = {
  kk,
  ru,
  en,
} as const;

const NAMESPACES = [
  'common',
  'errors',
  'tabs',
  'auth',
  'language',
  'profile',
  'home',
  'programs',
] as const;

console.log('hello');

const isSupported = (code?: string | null): code is SupportedLanguage =>
  !!code && (SUPPORTED_LANGUAGES as readonly string[]).includes(code);

const detectInitialLanguage = (): SupportedLanguage => {
  try {
    const best = RNLocalize.findBestLanguageTag(
      SUPPORTED_LANGUAGES as unknown as string[],
    );
    return isSupported(best?.languageTag)
      ? (best!.languageTag as SupportedLanguage)
      : FALLBACK_LANGUAGE;
  } catch {
    return FALLBACK_LANGUAGE;
  }
};

const applyResources = () => {
  SUPPORTED_LANGUAGES.forEach(lng => {
    const langResources = resources[lng] as Record<string, object> | undefined;
    if (!langResources) return;
    NAMESPACES.forEach(ns => {
      const bundle = langResources[ns];
      if (bundle) i18n.addResourceBundle(lng, ns, bundle, true, true);
    });
  });
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: detectInitialLanguage(),
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    defaultNS: DEFAULT_NAMESPACE,
    ns: NAMESPACES as unknown as string[],
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
    compatibilityJSON: 'v4',
    react: {
      useSuspense: false,
    },
  });

  i18n.on('languageChanged', lng => {
    if (isSupported(lng)) {
      AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lng).catch(() => undefined);
    }
  });
} else {
  applyResources();
  NAMESPACES.forEach(ns => {
    i18n.loadNamespaces(ns).catch(() => undefined);
  });
}

export { i18n };
