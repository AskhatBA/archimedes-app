import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  LANGUAGE_LABELS,
  LANGUAGE_SHORT_LABELS,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from './constants';

interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  shortLabel: string;
}

interface UseLanguageResult {
  language: SupportedLanguage;
  options: LanguageOption[];
  changeLanguage: (lng: SupportedLanguage) => Promise<void>;
  isCurrent: (lng: SupportedLanguage) => boolean;
}

export const useLanguage = (): UseLanguageResult => {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;

  const changeLanguage = useCallback(
    async (lng: SupportedLanguage) => {
      await i18n.changeLanguage(lng);
    },
    [i18n],
  );

  const options: LanguageOption[] = SUPPORTED_LANGUAGES.map((code) => ({
    code,
    label: LANGUAGE_LABELS[code],
    shortLabel: LANGUAGE_SHORT_LABELS[code],
  }));

  const isCurrent = useCallback(
    (lng: SupportedLanguage) => current === lng,
    [current],
  );

  return { language: current, options, changeLanguage, isCurrent };
};
