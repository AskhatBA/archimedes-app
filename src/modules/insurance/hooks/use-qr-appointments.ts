import { useQuery } from '@tanstack/react-query';

import { insuranceApi } from '@/api';

export const useQrAppointments = (clinicId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['qr-appointments', clinicId],
    queryFn: async () =>
      (await insuranceApi.qrAppointmentsList({ clinicId })).data.data,
    enabled: !!clinicId,
  });

  return {
    appointments: data ?? [],
    isLoading,
  };
};
