import { MISBranch, MISDoctor, MISSpecialization } from '@/api';

export interface CreateAppointmentForm {
  programId?: string;
  branchId?: MISBranch['id'];
  specializationId?: MISSpecialization['id'];
  doctorId?: MISDoctor['id'];
  date: string;
  timeSlot?: string;
  patientId?: string;
  isTelemedicine: boolean;
}

/**
 * Whose appointments a list shows. No `familyMemberId` — the account owner's own; with
 * one — that relative's, found on the owner's programme `programId`. The backend only
 * accepts the pair when the insurer lists the relative in that programme's family.
 */
export interface AppointmentsPatient {
  programId?: string;
  familyMemberId?: string;
}

/**
 * The price the booking form shows for a visit. A paid visit is charged exactly this —
 * `discountedPrice ?? price` — so the patient pays what they were shown.
 */
export interface VisitPrice {
  /** Full price; struck out next to `discountedPrice` when there is one. */
  price: number;
  /** The med-account price, when the insurer gives one for the service. */
  discountedPrice: number | null;
}
