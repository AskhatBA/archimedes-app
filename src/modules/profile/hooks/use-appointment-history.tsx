import { useQuery } from '@tanstack/react-query';

import { misApi } from '@/api';

export const useAppointmentHistory = () => {
  const { data: appointmentHistory, isLoading: loadingAppointmentHistory } =
    useQuery({
      queryKey: ['appointment-history'],
      queryFn: async () => {
        const data = await misApi.appointmentHistoryList();
        return data.data?.appointmentHistory || [];
      },
    });

  return {
    appointmentHistory,
    loadingAppointmentHistory,
  };
};
