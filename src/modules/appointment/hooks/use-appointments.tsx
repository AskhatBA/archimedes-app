import { useQuery } from '@tanstack/react-query';

import { misApi } from '@/api';

export const useAppointments = () => {
  const { data: appointments, isLoading: loadingAppointments } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () =>
      (await misApi.appointmentsList()).data?.appointments || [],
  });

  return {
    appointments,
    loadingAppointments,
  };
};
