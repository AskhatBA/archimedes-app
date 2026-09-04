import { FC } from 'react';

import {
  CATEGORY_HINT_KEYS,
  CATEGORY_LABEL_KEYS,
  PaidProgramsCatalog,
} from '@/modules/paid-programs';
import { usePageHeader } from '@/shared/hooks';
import { useTranslation } from '@/shared/lib/i18n';

/**
 * Check-ups are sold from the same catalogue machinery as med plans, but they are a
 * product of their own — a one-visit screening rather than a yearly plan — so they get
 * their own entry point instead of a tab inside the paid programs screen.
 */
export const CheckupsScreen: FC = () => {
  const { t } = useTranslation();

  usePageHeader({ title: t(CATEGORY_LABEL_KEYS.CHECKUP) });

  return (
    <PaidProgramsCatalog
      category="CHECKUP"
      hint={t(CATEGORY_HINT_KEYS.CHECKUP)}
    />
  );
};
