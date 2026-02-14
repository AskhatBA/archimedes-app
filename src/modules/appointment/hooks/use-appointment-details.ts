import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { misApi } from '@/api';
import { GET_APPOINTMENT_DETAILS_QUERY } from '@/shared/constants';

export const useAppointmentDetails = (appointmentId: string) => {
  const { data: appointment, isLoading: isAppointmentLoading } = useQuery({
    queryKey: [GET_APPOINTMENT_DETAILS_QUERY, appointmentId],
    queryFn: async () =>
      (await misApi.appointmentsDetail(appointmentId)).data.appointment,
  });

  useEffect(() => {
    console.log('appointment:', appointment);
  }, [appointment]);

  return { appointment, isAppointmentLoading };
};
