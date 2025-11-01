/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RequestOTPBody {
  /**
   * Phone number starting with 7 followed by 10 digits
   * @example "77771400962"
   */
  phone: string;
}

export interface RequestOTPResponse {
  /**
   * User ID
   * @format uuid
   */
  id?: string;
  /** Phone number */
  phone?: string;
}

export interface VerifyOTPBody {
  /**
   * User's phone number starting with 7 followed by 10 digits
   * @example "77051234567"
   */
  phone: string;
  /**
   * OTP code received by the user
   * @example "1234"
   */
  otp: string;
}

export interface VerifyOTPResponse {
  /** @example true */
  success?: boolean;
  /** JWT access token */
  accessToken?: string;
  /** JWT refresh token */
  refreshToken?: string;
}

export interface InsuranceVerifyOtpBody {
  otp?: string;
}

export interface FileItem {
  /** @example "Кассовый чек" */
  fileType: string;
  /**
   * File name with extension
   * @example "cheque.pdf"
   */
  fileName: string;
  /**
   * Base64-encoded content; can be empty if not provided yet
   * @format byte
   * @minLength 0
   * @example ""
   */
  content: string;
}

/** @minItems 1 */
export type Files = FileItem[];

export interface RefundRequestBody {
  /** @example "2025-09-01" */
  date?: string;
  /** @example 1000 */
  amount?: number;
  /** @example "a2f6c7d8-3b1e-4f0a-9c3d-7e5a1b2c3d4e" */
  personId?: string;
  /** @example "a2f6c7d8-3b1e-4f0a-9c3d-7e5a1b2c3d4e" */
  programId?: string;
  files?: Files;
}

export interface InsuranceProgram {
  /** @example "1234" */
  id: string;
  /** @example "PRG001" */
  code: string;
  /** @example "Basic Insurance" */
  title: string;
  /** @example "active" */
  status: string;
  /** @example "4111111111111111" */
  cardNo: string;
  /**
   * @format date
   * @example "2025-01-01"
   */
  dateStart: string;
  /**
   * @format date
   * @example "2025-12-31"
   */
  dateEnd: string;
}

export interface InsuranceProgramsResponse {
  success?: boolean;
  programs?: InsuranceProgram[];
}

export interface InsuranceProgramExtended {
  id?: string;
  code?: string;
  title?: string;
  status?: string;
  cardNo?: string;
  insurer?: string;
  insuranceCompany?: string;
  /** @format date */
  dateStart?: string;
  /** @format date */
  dateEnd?: string;
  information?: string;
  programUrl?: string;
  stdexclusions?: string;
  exclusions?: string;
  inclusions?: string;
  limit?: number;
  currentLimit?: number;
  logo?: string;
  subLimits?: {
    name?: string;
    limit?: number;
    currentLimit?: number;
    incidentLimit?: number;
    currentIncidentLimit?: number;
  }[];
}

export interface InsuranceProgramResponse {
  success?: boolean;
  program?: InsuranceProgramExtended;
}

export interface InsuranceFamily {
  /** @example "1234" */
  id: string;
  /** @example "John Doe" */
  fullName: string;
  /** @example "spouse" */
  relationship: string;
  /**
   * @format date
   * @example "1990-01-01"
   */
  dateBirth: string;
}

export interface InsuranceFamilyResponse {
  success?: boolean;
  family?: InsuranceFamily[];
}

export interface InsuranceRefundRequest {
  /** @example 1234 */
  id: number;
  /** @example "John Doe" */
  sender: string;
  /** @example "Jane Doe" */
  person: string;
  /** @example "+77071234567" */
  phoneNo: string;
  /**
   * @format date
   * @example "2025-09-01"
   */
  date: string;
  /** @example 1000 */
  amount: number;
  /** @example "pending" */
  status: string;
}

export interface InsuranceRefundRequestsResponse {
  success?: boolean;
  refundRequests?: InsuranceRefundRequest[];
}

export interface AvailableInsuranceCity {
  /** @example 1 */
  id: number;
  /** @example "Астана" */
  title: string;
}

export interface MedicalNetworkClinics {
  /** @example 1 */
  id?: number;
  /** @example 1 */
  city?: number;
  /** @example "Medical Center" */
  title?: string;
  /** @example "123 Healthcare St." */
  address?: string;
  /** @example null */
  contacts?: any;
  /** @example 51.1801 */
  latitude?: number;
  /** @example 71.446 */
  longitude?: number;
  /** @example "https://2gis.kz/clinic" */
  link2GIS?: string;
  /** @example null */
  extraInformation?: any;
}

export interface ElectronicReferralDetail {
  id?: number;
  service?: string;
  amount?: number;
}

export interface ElectronicReferralItem {
  id?: number;
  /** @example "10.11.2020" */
  date?: string;
  /** @example "Иванов Иван Иванович" */
  name?: string;
  /** @example "Алматы, ТОО Архимедес" */
  medical_institution?: string;
  /** @example "Остеохондроз" */
  diagnosis?: string;
  /** @example 3850 */
  amount?: number;
  /** @example "KZT" */
  currency?: string;
  appointmentDetail?: ElectronicReferralDetail[];
}

export interface ContactInfo {
  /** @example "Астана" */
  city: string;
  /** @example ["+7 (7172) 123-456","+7 (7172) 654-321"] */
  phones: string[];
}

export interface MISPatient {
  id: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  /** @format date */
  birthDate: string;
  gender: 'M' | 'F';
  iin: string;
}

export interface CreateMISPatientBody {
  /** @example "77771234567" */
  phoneNumber: string;
  /** @example "John" */
  firstName: string;
  /** @example "Doe" */
  lastName: string;
  /** @example "Smith" */
  patronymic?: string;
  /** @example "M" */
  gender: 'M' | 'F';
  /**
   * @format date
   * @example "1990-01-01"
   */
  birthDate: string;
  /** @example "123456789012" */
  iin: string;
}

export interface CreateMISPatientResponse {
  /** @example "7f5a8b13-74e8-4c25-9ac5-bc2df1cf9f64" */
  id?: string;
  /** @example "John Doe" */
  name?: string;
  /** @example 0 */
  gender: number;
  /** @example "999999999999" */
  iin: string;
  /** @example "87771112233" */
  phone_number?: string;
  /** @example "Street, something" */
  address?: string;
  /** @example "Street, something" */
  address_details?: string;
}

export interface MISBranch {
  id?: string;
  name?: string;
  address?: string;
}

export interface MISSpecialization {
  id?: string;
  name?: string;
}

export interface MISDoctor {
  id?: string;
  name?: string;
  position?: string;
  specialtyName?: string;
  branchName?: string;
  appointmentDurationMinutes?: number;
}

export interface MISAvailableTime {
  /**
   * The start time of the slot
   * @example "09:00"
   */
  startTime: string;
  /**
   * The end time of the slot
   * @example "09:30"
   */
  endTime: string;
  /**
   * Whether the time slot is available
   * @example true
   */
  available: boolean;
}

export interface MISAvailableDay {
  /**
   * The date for this set of time slots
   * @example "2023-12-01"
   */
  date: string;
  /** Array of time slots for this date */
  timeSlots: MISAvailableTime[];
}

export type MISAvailableSlots = Record<string, MISAvailableDay>;

export interface CreateMISAppointmentBody {
  /** @example "f47ac10b-58cc-4372-a567-0e02b2c3d479" */
  doctorId: string;
  /** @example "2025-09-10" */
  startTime: string;
  /** @example "2025-09-10" */
  endTime: string;
  /** @example "8b9a7c6d-5e4f-4321-a987-6543210fedcb" */
  branchId: string;
  /** @example "f47ac10b-58cc-4372-a567-0e02b2c3d479" */
  patientId?: string;
  /** @example "8b9a7c6d-5e4f-4321-a987-6543210fedcb" */
  insuranceProgramId?: string;
}

export interface MISAppointment {
  id?: string;
  doctor_name?: string;
  beneficiary_name?: string;
  branch_name?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  status_display?: string;
  record_type?: string;
  record_type_display?: string;
  appointment_type?: string;
  appointment_type_display?: string;
  notes?: string;
}

export interface GetPatientProfileResponse {
  success?: boolean;
  isProfileComplete?: boolean;
  user?: {
    id?: string;
    phone?: string;
    role?: string;
  };
  patient?: {
    id?: string;
    userId?: string;
    firstName?: string;
    lastName?: string;
    patronymic?: string;
    fullName?: string;
    birthDate?: string;
    gender?: string;
  };
}

export interface CreatePatientBody {
  firstName: string;
  lastName: string;
  patronymic?: string;
  /** @format date */
  birthDate: string;
  iin: string;
  gender: 'M' | 'F';
}
