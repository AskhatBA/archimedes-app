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
  RegisterCompleteBody,
  RegisterStartBody,
  RegisterStartResponse,
  RegisterVerifyOtpBody,
  RegisterVerifyOtpResponse,
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
   * @description Login only — this endpoint never creates an account. If no account matches the phone/IIN it returns 404 `ACCOUNT_NOT_FOUND` and the client should send the user through `/auth/register/*`.
   * @tags Auth
   * @name RequestOtpCreate
   * @summary Request an OTP code to sign in to an existing account
   * @request POST:/auth/request-otp
   * @secure
   * @response `200` `RequestOTPResponse` OTP code generated successfully
   * @response `400` `void` Invalid input — `INVALID_PHONE` or `INSURANCE_PHONE_IS_NOT_MATCHED`
   * @response `404` `void` No account exists for this phone/IIN — `ACCOUNT_NOT_FOUND`
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
   * @name RegisterStartCreate
   * @summary Registration step 1 — check the identity is new and send a confirmation code
   * @request POST:/auth/register/start
   * @secure
   * @response `200` `RegisterStartResponse` Confirmation code sent
   * @response `400` `void` Invalid input — `INVALID_PHONE`, or `INSURANCE_PHONE_IS_NOT_MATCHED` when the insurance record for this IIN holds a different number
   * @response `409` `void` An account already exists — `ACCOUNT_ALREADY_EXISTS`. The user should sign in instead.
   */
  export namespace RegisterStartCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RegisterStartBody;
    export type RequestHeaders = {};
    export type ResponseBody = RegisterStartResponse;
  }

  /**
   * No description
   * @tags Auth
   * @name RegisterVerifyOtpCreate
   * @summary Registration step 2 — verify the code and get the MIS data to pre-fill the form
   * @request POST:/auth/register/verify-otp
   * @secure
   * @response `200` `RegisterVerifyOtpResponse` Code verified
   * @response `400` `void` Invalid or expired code — `INVALID_OTP` / `OTP_EXPIRED`
   * @response `409` `void` An account already exists — `ACCOUNT_ALREADY_EXISTS`
   */
  export namespace RegisterVerifyOtpCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RegisterVerifyOtpBody;
    export type RequestHeaders = {};
    export type ResponseBody = RegisterVerifyOtpResponse;
  }

  /**
   * @description Creates the MIS patient when one does not exist yet, then creates the user and patient profile in a single transaction and returns a session.
   * @tags Auth
   * @name RegisterCompleteCreate
   * @summary Registration step 3 — create the account and sign the user in
   * @request POST:/auth/register/complete
   * @secure
   * @response `201` `VerifyOTPResponse` Account created; tokens issued
   * @response `400` `void` Invalid profile data, or the patient could not be created in MIS
   * @response `401` `void` Missing, malformed or expired registration token — `INVALID_REGISTRATION_TOKEN`
   * @response `409` `void` An account already exists — `ACCOUNT_ALREADY_EXISTS`
   */
  export namespace RegisterCompleteCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RegisterCompleteBody;
    export type RequestHeaders = {};
    export type ResponseBody = VerifyOTPResponse;
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
