import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { insuranceApi } from '@/api';

export const useReferralsSummary = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['qr-appointments'],
    queryFn: async () =>
      (
        await insuranceApi.qrAppointmentsList({
          clinicId: '45089042-F446-4E32-8BE1-B6D281232A91',
        })
      ).data,
  });

  useEffect(() => {
    console.log('qr-appointments', data);
  }, [data]);

  return {
    summary: { activeCount: data?.data?.length ?? 0 },
    isLoading,
  };
};
