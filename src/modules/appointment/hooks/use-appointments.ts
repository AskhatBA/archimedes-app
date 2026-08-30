import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { misApi } from '@/api';
import {
  useRefetchOnScreenFocus,
  useScreenRefetchInterval,
} from '@/shared/hooks';

import { APPOINTMENTS_REFRESH_INTERVAL_MS } from '../constants';

interface UseAppointmentInput {
  filter?: {
    startDate?: string;
  };
}

export const useAppointments = (props?: UseAppointmentInput) => {
  const refetchInterval = useScreenRefetchInterval(
    APPOINTMENTS_REFRESH_INTERVAL_MS,
  );

  const {
    data: appointments,
    isLoading: loadingAppointments,
    refetch,
  } = useQuery({
    queryKey: ['appointments', props?.filter?.startDate],
    queryFn: async () => {
      const data = (await misApi.appointmentsList()).data?.appointments || [];

      if (props?.filter?.startDate) {
        return data.filter(appointment =>
          dayjs(appointment.start_time).isSame(props.filter.startDate, 'day'),
        );
      }

      return data;
    },
    refetchInterval,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  useRefetchOnScreenFocus(refetch);

  return {
    appointments,
    loadingAppointments,
  };
};
