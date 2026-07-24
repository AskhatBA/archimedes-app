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

import {
  ChangePhoneBody,
  ChangePhoneResponse,
  RefreshBody,
  RefreshResponse,
  RequestOTPBody,
  RequestOTPResponse,
  SessionHistoryResponse,
  SetBiometricBody,
  SetPinBody,
  VerifyOTPBody,
  VerifyOTPResponse,
  VerifyPinBody,
} from './data-contracts';

export namespace Auth {
  /**
   * No description
   * @tags Auth
   * @name RequestOtpCreate
   * @summary Request OTP code for phone verification
   * @request POST:/auth/request-otp
   * @secure
   * @response `200` `RequestOTPResponse` OTP code generated successfully
   * @response `400` `void` Invalid phone number format
   */
  export namespace RequestOtpCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RequestOTPBody;
    export type RequestHeaders = {};
    export type ResponseBody = RequestOTPResponse;
  }

  /**
   * No description
   * @tags Auth
   * @name VerifyOtpCreate
   * @summary Verify OTP code and get authentication tokens
   * @request POST:/auth/verify-otp
   * @secure
   * @response `200` `VerifyOTPResponse` OTP verified successfully
   * @response `400` `void` Invalid or expired OTP
   * @response `404` `void` User not found
   */
  export namespace VerifyOtpCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = VerifyOTPBody;
    export type RequestHeaders = {};
    export type ResponseBody = VerifyOTPResponse;
  }

  /**
   * No description
   * @tags Auth
   * @name ChangePhoneCreate
   * @summary Update authenticated user's phone number
   * @request POST:/auth/change-phone
   * @secure
   * @response `200` `ChangePhoneResponse` Phone updated
   * @response `400` `void` Invalid phone or already in use
   * @response `401` `void` Unauthorized
   */
  export namespace ChangePhoneCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ChangePhoneBody;
    export type RequestHeaders = {};
    export type ResponseBody = ChangePhoneResponse;
  }

  /**
 * No description
 * @tags Auth
 * @name LogoutCreate
 * @summary Invalidate the current session by clearing the refresh token
 * @request POST:/auth/logout
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,

}` Logged out successfully
 * @response `401` `void` Unauthorized
*/
  export namespace LogoutCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
    };
  }

  /**
   * No description
   * @tags Auth
   * @name RefreshCreate
   * @summary Exchange a refresh token for a fresh 15-minute access token
   * @request POST:/auth/refresh
   * @secure
   * @response `200` `RefreshResponse` Session refreshed
   * @response `401` `void` Invalid, expired, revoked, or superseded refresh token
   */
  export namespace RefreshCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RefreshBody;
    export type RequestHeaders = {};
    export type ResponseBody = RefreshResponse;
  }

  /**
   * No description
   * @tags Auth
   * @name PostAuth
   * @summary Set or replace the authenticated user's PIN
   * @request POST:/auth/pin
   * @secure
   * @response `200` `void` PIN saved
   * @response `400` `void` Invalid PIN format
   * @response `401` `void` Unauthorized
   */
  export namespace PostAuth {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SetPinBody;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Auth
   * @name PinVerifyCreate
   * @summary Verify a PIN (biometric fallback) and get a fresh session
   * @request POST:/auth/pin/verify
   * @secure
   * @response `200` `RefreshResponse` PIN verified; new tokens issued
   * @response `400` `void` Invalid PIN or PIN not set
   * @response `429` `void` Too many failed attempts; PIN temporarily locked
   */
  export namespace PinVerifyCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = VerifyPinBody;
    export type RequestHeaders = {};
    export type ResponseBody = RefreshResponse;
  }

  /**
   * No description
   * @tags Auth
   * @name BiometricCreate
   * @summary Enable or disable biometric login for the authenticated user
   * @request POST:/auth/biometric
   * @secure
   * @response `200` `void` Biometric preference updated
   * @response `401` `void` Unauthorized
   */
  export namespace BiometricCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SetBiometricBody;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Auth
   * @name SessionsList
   * @summary List the authenticated user's login (session) history
   * @request GET:/auth/sessions
   * @secure
   * @response `200` `SessionHistoryResponse` Login history, most recent first
   * @response `401` `void` Unauthorized
   */
  export namespace SessionsList {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * @min 1
       * @max 100
       * @default 50
       */
      limit?: number;
      /**
       * @min 0
       * @default 0
       */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SessionHistoryResponse;
  }
}
