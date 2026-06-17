import AsyncStorage from '@react-native-async-storage/async-storage';
import { FC, ReactNode, useCallback, useEffect, useState } from 'react';

import { LanguageSelectScreen } from '@/screens/language-select';
import { ScreenLoader } from '@/shared/components/screen-loader';

import { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from './constants';
import type { SupportedLanguage } from './constants';
import { i18n } from './i18n';

type Status = 'loading' | 'select' | 'ready';

const isSupported = (code?: string | null): code is SupportedLanguage =>
  !!code && (SUPPORTED_LANGUAGES as readonly string[]).includes(code);

export const LanguageGate: FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then(async stored => {
        if (cancelled) return;
        if (isSupported(stored)) {
          if (stored !== i18n.language) await i18n.changeLanguage(stored);
          setStatus('ready');
        } else {
          setStatus('select');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('select');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onSelect = useCallback(async (lng: SupportedLanguage) => {
    await i18n.changeLanguage(lng);
    setStatus('ready');
  }, []);

  if (status === 'loading') return <ScreenLoader />;
  if (status === 'select') return <LanguageSelectScreen onSelect={onSelect} />;
  return <>{children}</>;
};
