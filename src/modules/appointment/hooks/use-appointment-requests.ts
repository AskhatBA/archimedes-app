import { useQuery } from '@tanstack/react-query';

import { misApi } from '@/api';

export const useAppointmentRequests = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['appointment-requests'],
    queryFn: async () => {
      const response = await misApi.appointmentRequestsList();
      const requests = response.data?.requests || [];
      return requests.filter(r => !r.is_archived && r.status !== 'rejected');
    },
  });

  return {
    appointmentRequests: data,
    isLoading,
  };
};
