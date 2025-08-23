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
