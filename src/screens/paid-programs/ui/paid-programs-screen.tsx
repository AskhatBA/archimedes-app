import { FC } from 'react';

import {
  CATEGORY_HINT_KEYS,
  CATEGORY_LABEL_KEYS,
  PaidProgramsCatalog,
} from '@/modules/paid-programs';
import { usePageHeader } from '@/shared/hooks';
import { useTranslation } from '@/shared/lib/i18n';

/** Med plans only — check-ups live on their own screen, see `CheckupsScreen`. */
export const PaidProgramsScreen: FC = () => {
  const { t } = useTranslation();

  usePageHeader({ title: t(CATEGORY_LABEL_KEYS.MED_PLAN) });

  return (
    <PaidProgramsCatalog
      category="MED_PLAN"
      hint={t(CATEGORY_HINT_KEYS.MED_PLAN)}
    />
  );
};
