import { FC } from 'react';

import { BookingHistory } from '@/modules/appointment';
import { usePageHeader } from '@/shared/hooks';
import { useTranslation } from '@/shared/lib/i18n';

/**
 * Every visit booked through the app, read from our own backend (`GET /appointments/history`)
 * rather than the MIS proxy — cancelled visits and their refunds included.
 */
export const AppointmentHistoryScreen: FC = () => {
  const { t } = useTranslation();

  usePageHeader({ title: t('appointments:history') });

  return <BookingHistory />;
};
