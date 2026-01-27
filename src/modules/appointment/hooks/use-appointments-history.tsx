import { useQuery } from '@tanstack/react-query';

import { misApi } from '@/api';

export const useAppointmentsHistory = () => {
  const { data: appointmentsHistory, isLoading: loadingAppointmentsHistory } =
    useQuery({
      queryKey: ['appointments-history'],
      queryFn: async () => {
        const data = await misApi.appointmentHistoryList();
        return data.data?.appointmentHistory || [];
      },
    });

  return {
    appointmentsHistory,
    loadingAppointmentsHistory,
  };
};
