import { useQuery } from '@tanstack/react-query';

import { misApi } from '@/api';
import {
  useRefetchOnScreenFocus,
  useScreenRefetchInterval,
} from '@/shared/hooks';

import { APPOINTMENTS_REFRESH_INTERVAL_MS } from '../constants';

export const useAppointmentsHistory = () => {
  const refetchInterval = useScreenRefetchInterval(
    APPOINTMENTS_REFRESH_INTERVAL_MS,
  );

  const {
    data: appointmentsHistory,
    isLoading: loadingAppointmentsHistory,
    refetch,
  } = useQuery({
    queryKey: ['appointments-history'],
    queryFn: async () => {
      const data = await misApi.appointmentHistoryList();
      return data.data?.appointmentHistory || [];
    },
    // MIS owns the status of a visit and never tells us when it changes, so the list is
    // only as current as the last read.
    refetchInterval,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  useRefetchOnScreenFocus(refetch);

  return {
    appointmentsHistory,
    loadingAppointmentsHistory,
  };
};
