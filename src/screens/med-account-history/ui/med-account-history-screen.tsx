import { FC } from 'react';

import { TopupHistory } from '@/modules/med-account';
import { usePageHeader } from '@/shared/hooks';
import { useTranslation } from '@/shared/lib/i18n';

/** Opened from the top-up screen: every top-up the patient has paid for, and its status. */
export const MedAccountHistoryScreen: FC = () => {
  const { t } = useTranslation();

  usePageHeader({ title: t('medAccount:history.title') });

  return <TopupHistory />;
};
