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

export interface Appointment {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  patientId?: string;
  /** @format uuid */
  doctorId?: string;
  /** @format uuid */
  externalId?: string;
  /** @format date-time */
  dateTime?: string;
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string | null;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  patient?: object;
  doctor?: object;
}

export interface CreateAppointmentBody {
  /** @format uuid */
  patientId: string;
  /** @format uuid */
  doctorId: string;
  /** @format uuid */
  externalId: string;
  /** @format date-time */
  dateTime: string;
  notes?: string;
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export interface UpdateAppointmentBody {
  /** @format date-time */
  dateTime?: string;
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

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
  /**
   * Refund category type:
   * * 0 - АПП (амбулаторно-поликлиническая помощь)
   * * 4 - Стоматология
   * * 5 - Медикаменты
   * * 2 - Стацинарное лечение
   * @example 0
   */
  category?: 0 | 2 | 4 | 5;
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
  /** @example "3f7c2a6b-8e3d-4f5b-b9f4-1b2a9c8e6d21" */
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
  /** @example "a1c4f9d2-6b7e-4a13-9f82-5d3e8b6a4c70" */
  benId?: string;
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

export interface ClinicType {
  /** @example 1 */
  id: number;
  /** @example "Поликлиника" */
  title: string;
}

export interface CreateMeetingBody {
  /** @example "Patient Consultation" */
  topic: string;
  /**
   * ISO 8601 date-time in UTC
   * @format date-time
   * @example "2026-02-10T10:00:00Z"
   */
  start_time: string;
  /**
   * Meeting duration in minutes
   * @example 30
   */
  duration: number;
}

export interface MeetingResponse {
  /** @example "123456789" */
  meetingId?: string;
  /** @example "https://zoom.us/j/123456789" */
  joinUrl?: string;
  /** @example "https://zoom.us/s/123456789" */
  startUrl?: string;
}

export interface RecordingFile {
  id?: string;
  /** @example "MP4" */
  fileType?: string;
  /** @example 52428800 */
  fileSize?: number;
  /** @example "https://zoom.us/rec/download/..." */
  downloadUrl?: string;
  /** @example "shared_screen_with_speaker_view" */
  recordingType?: string;
}

export interface RecordingResponse {
  /** @example "123456789" */
  meetingId?: string;
  /** @example "Patient Consultation" */
  topic?: string;
  /** @format date-time */
  startTime?: string;
  /** @example 30 */
  duration?: number;
  files?: RecordingFile[];
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
  /** @example false */
  isTelemedicine: boolean;
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
  /** @example "82621241232" */
  meeting_id?: string;
  /** @example "https://us05web.zoom.us/j/82621241232?pwd=4o5c456vxgrrCQaUroAbGISNB3zkb5.1" */
  meeting_join_url?: string;
  /** @example "https://us05web.zoom.us/s/82621241232?zak=eyJ0eXAiOiJKV1QiLCJzdiI6IjAwMDAwMiIsInptX3NrbSI6InptX28ybSIsImFsZyI6IkhTMjU2In0.eyJpc3MiOiJ3ZWIiLCJjbHQiOjAsIm1udW0iOiI4MjYyMTI0MjYxMiIsImF1ZCI6ImNsaWVudHNtIiwidWlkIjoiMlJpRjZWLVhRaHlXNDBkaVpOV3NsZyIsInppZCI6ImE0MmUyMTVlMzU0MDRhZTc4NWFjMzc0YjgyMzBjNDQ3Iiwic2siOiIwIiwic3R5IjoxMDAsIndjZCI6InVzMDUiLCJleHAiOjE3NzExMDEzMDc3ImlhdCI6Mfc3MTA5NDEwNywigWlkIjoiNkpDNWlsRFfTY3k4RmVGYmZZQUVuZyIsIrNpZCI6IiJ9.wfFK-x91l1FFedCFgquu7fYq4zxlmrDi-e80OH08zkI" */
  meeting_start_url?: string;
}

export interface MISAppointmentHistoryDoctor {
  id?: string;
  name?: string;
  specialtyName?: string;
  branchName?: string;
  position?: string;
  appointmentDurationMinutes?: number;
}

export interface MISAppointmentHistoryDocument {
  id?: string;
  documentTypeName?: string;
  fileUrl?: string;
  status?: string;
  createdAt?: string;
}

export interface MISAppointmentHistory {
  id?: string;
  doctor?: MISAppointmentHistoryDoctor;
  actualStartTime?: string;
  diagnosis?: string | null;
  documents?: MISAppointmentHistoryDocument[];
  templateType?: string;
  appointmentType?: string;
  appointmentTypeDisplay?: string;
}

export interface MISLaboratoryResult {
  /** Registration date of laboratory result */
  registrationDate: string;
  /** Laboratory result number */
  number: string;
  /** Full name of the patient */
  patientFullName: string;
  /** Birth date of the patient */
  birthDate: string;
  /** Base64 encoded PDF document */
  pdfBase64: string;
  /** Name of the department */
  departmentName: string;
  /** Name of the biomaterial */
  biomaterialName: string;
}

export interface RegisterDeviceBody {
  /**
   * Unique device identifier (OneSignal player ID or FCM token)
   * @example "abc123-def456-ghi789"
   */
  deviceId: string;
  /**
   * Device platform
   * @example "IOS"
   */
  platform: 'IOS' | 'ANDROID' | 'WEB';
}

export interface RegisterDeviceResponse {
  /** @example true */
  success?: boolean;
  data?: {
    /** @format uuid */
    id?: string;
    /** @format uuid */
    userId?: string;
    deviceId?: string;
    platform?: 'IOS' | 'ANDROID' | 'WEB';
    /** @format date-time */
    createdAt?: string;
  };
}

export interface DeviceListResponse {
  /** @example true */
  success?: boolean;
  data?: {
    /** @format uuid */
    id?: string;
    deviceId?: string;
    platform?: 'IOS' | 'ANDROID' | 'WEB';
    /** @format date-time */
    createdAt?: string;
  }[];
}

export interface SendNotificationBody {
  /**
   * Target user ID
   * @format uuid
   */
  userId: string;
  /**
   * Notification title
   * @example "New Appointment"
   */
  title?: string;
  /**
   * Notification message
   * @example "You have a new appointment scheduled"
   */
  message: string;
  /** Additional data payload */
  data?: Record<string, any>;
}

export interface SuccessResponse {
  /** @example true */
  success?: boolean;
  message?: string;
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
