import { MISBranch, MISDoctor, MISSpecialization } from '@/api';

export interface CreateAppointmentForm {
  programId?: string;
  branchId?: MISBranch['id'];
  specializationId?: MISSpecialization['id'];
  doctorId?: MISDoctor['id'];
  date: string;
  timeSlot?: string;
  patientId?: string;
}
