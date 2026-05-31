import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LanguageDetectorAsyncModule } from 'i18next';
import * as RNLocalize from 'react-native-localize';

import {
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from './constants';

const isSupported = (code: string): code is SupportedLanguage =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(code);

export const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  init: () => undefined,
  detect: async () => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && isSupported(stored)) return stored;

      const best = RNLocalize.findBestLanguageTag(
        SUPPORTED_LANGUAGES as unknown as string[],
      );
      return best?.languageTag ?? FALLBACK_LANGUAGE;
    } catch {
      return FALLBACK_LANGUAGE;
    }
  },
  cacheUserLanguage: async (lng: string) => {
    try {
      if (isSupported(lng)) {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
      }
    } catch {
      // no-op: persistence failures shouldn't break translation
    }
  },
};
