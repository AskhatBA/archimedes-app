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
 * The price the booking form shows for a visit. A paid visit is charged exactly this —
 * `discountedPrice ?? price` — so the patient pays what they were shown.
 */
export interface VisitPrice {
  /** Full price; struck out next to `discountedPrice` when there is one. */
  price: number;
  /** The med-account price, when the insurer gives one for the service. */
  discountedPrice: number | null;
}
