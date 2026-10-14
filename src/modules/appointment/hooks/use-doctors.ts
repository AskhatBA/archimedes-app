import { useQuery } from '@tanstack/react-query';

import { appointmentApi } from '@/api';

import { appointmentsPatientQuery } from '../lib/appointments-patient';
import { AppointmentsPatient } from '../types';

/**
 * Doctors of a branch for a specialty. The backend narrows the list by the age of whoever
 * the visit is for — a child sees only pediatric doctors, an adult none of them — so it is
 * cached per patient: switching to a relative may change who is on it.
 */
export const useDoctors = (
  branchId?: string,
  specializationId?: string,
  patient?: AppointmentsPatient,
) => {
  const { data: doctors, isLoading: loadingDoctors } = useQuery({
    queryKey: ['doctors', branchId, specializationId, patient?.familyMemberId],
    queryFn: async () =>
      (
        await appointmentApi.doctorsList({
          branchId: branchId!,
          specializationId: specializationId!,
          ...appointmentsPatientQuery(patient),
        })
      ).data?.doctors || [],
    enabled: !!branchId && !!specializationId,
  });

  return {
    doctors: doctors || [],
    loadingDoctors,
  };
};
