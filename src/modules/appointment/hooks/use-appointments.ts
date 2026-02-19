import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { misApi } from '@/api';

interface UseAppointmentInput {
  filter?: {
    startDate?: string;
  };
}

export const useAppointments = (props?: UseAppointmentInput) => {
  const { data: appointments, isLoading: loadingAppointments } = useQuery({
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
  });

  return {
    appointments,
    loadingAppointments,
  };
};
