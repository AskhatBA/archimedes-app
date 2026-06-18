import { useQuery } from '@tanstack/react-query';

import { insuranceApi } from '@/api';

export const useReferralsSummary = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['qr-appointments'],
    queryFn: async () => (await insuranceApi.qrAppointmentsList()).data,
  });

  return {
    summary: { activeCount: data?.data?.length ?? 0 },
    isLoading,
  };
};
