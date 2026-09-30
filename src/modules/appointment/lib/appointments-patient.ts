import { AppointmentsPatient } from '../types';

/**
 * The query the MIS appointment endpoints take to read a relative's visits instead of the
 * owner's. `programId` alone changes nothing — it only vouches for a `familyMemberId` —
 * so the owner's own lists are requested exactly as before.
 */
export const appointmentsPatientQuery = (
  patient?: AppointmentsPatient,
): { familyMemberId: string; programId?: string } | undefined =>
  patient?.familyMemberId
    ? { familyMemberId: patient.familyMemberId, programId: patient.programId }
    : undefined;
