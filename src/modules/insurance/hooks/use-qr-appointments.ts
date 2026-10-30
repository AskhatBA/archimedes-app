import { useQuery } from '@tanstack/react-query';

import { insuranceQrApi } from '@/api';

/**
 * Whose referrals to read — the account owner's by default, or a relative's on the
 * owner's programme. The same shape as the appointments list's `AppointmentsPatient`.
 */
export interface QrReferralsPatient {
  programId?: string;
  familyMemberId?: string;
}

/**
 * The query that reads a relative's referrals instead of the owner's. `programId` alone
 * changes nothing — it only vouches for a `familyMemberId`.
 */
export const qrReferralsPatientQuery = (patient?: QrReferralsPatient) =>
  patient?.familyMemberId
    ? { familyMemberId: patient.familyMemberId, programId: patient.programId }
    : {};

export const useQrAppointments = (
  clinicId: string,
  patient?: QrReferralsPatient,
) => {
  const { data, isLoading } = useQuery({
    // Keyed on the person, so `['qr-appointments', clinicId]` still refreshes everyone's.
    queryKey: ['qr-appointments', clinicId, patient?.familyMemberId ?? null],
    queryFn: async () =>
      (
        await insuranceQrApi.appointmentsList({
          clinicId,
          ...qrReferralsPatientQuery(patient),
        })
      ).data.data,
    enabled: !!clinicId,
  });

  return {
    appointments: data ?? [],
    isLoading,
  };
};
