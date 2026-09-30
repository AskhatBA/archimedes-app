import { useQuery } from '@tanstack/react-query';

import { misApi } from '@/api';
import { GET_APPOINTMENT_DETAILS_QUERY } from '@/shared/constants';

import { appointmentsPatientQuery } from '../lib/appointments-patient';
import { AppointmentsPatient } from '../types';

/**
 * MIS looks a visit up under its patient, so a relative's visit is only found when the
 * details are asked for as that relative — the same `patient` the list was read with.
 */
export const useAppointmentDetails = (
  appointmentId: string,
  patient?: AppointmentsPatient,
) => {
  const { data: appointment, isLoading: isAppointmentLoading } = useQuery({
    queryKey: [
      GET_APPOINTMENT_DETAILS_QUERY,
      appointmentId,
      patient?.familyMemberId ?? null,
    ],
    queryFn: async () =>
      (
        await misApi.appointmentsDetail(
          appointmentId,
          appointmentsPatientQuery(patient),
        )
      ).data.appointment,
  });

  return { appointment, isAppointmentLoading };
};
