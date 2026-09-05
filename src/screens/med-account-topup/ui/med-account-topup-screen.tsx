import { FC } from 'react';

import { MedAccountTopup } from '@/modules/med-account';
import { usePageHeader } from '@/shared/hooks';
import { useTranslation } from '@/shared/lib/i18n';

/**
 * Opened from the medical-account card on the home screen: the amounts the account can be
 * topped up by, and the payment that follows picking one.
 */
export const MedAccountTopupScreen: FC = () => {
  const { t } = useTranslation();

  usePageHeader({ title: t('medAccount:topup.title') });

  return <MedAccountTopup />;
};
