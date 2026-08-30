import { useQuery } from '@tanstack/react-query';

import { misApi } from '@/api';
import {
  useRefetchOnScreenFocus,
  useScreenRefetchInterval,
} from '@/shared/hooks';

import { APPOINTMENTS_REFRESH_INTERVAL_MS } from '../constants';

export const useAppointmentRequests = () => {
  const refetchInterval = useScreenRefetchInterval(
    APPOINTMENTS_REFRESH_INTERVAL_MS,
  );

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['appointment-requests'],
    queryFn: async () => {
      const response = await misApi.appointmentRequestsList();
      const requests = response.data?.requests || [];
      return requests.filter(r => !r.is_archived && r.status !== 'rejected');
    },
    // A request is approved or rejected by the clinic, not here — polling is the only way
    // the patient finds out without reopening the app.
    refetchInterval,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  useRefetchOnScreenFocus(refetch);

  return {
    appointmentRequests: data,
    isLoading,
  };
};
