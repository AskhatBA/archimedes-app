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
