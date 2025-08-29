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
  /** Generated OTP code */
  otp?: string;
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
