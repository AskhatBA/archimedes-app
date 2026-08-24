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
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Auth<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Login only — this endpoint never creates an account. If no account matches the phone/IIN it returns 404 `ACCOUNT_NOT_FOUND` and the client should send the user through `/auth/register/*`.
   *
   * @tags Auth
   * @name RequestOtpCreate
   * @summary Request an OTP code to sign in to an existing account
   * @request POST:/auth/request-otp
   * @secure
   * @response `200` `RequestOTPResponse` OTP code generated successfully
   * @response `400` `void` Invalid input — `INVALID_PHONE` or `INSURANCE_PHONE_IS_NOT_MATCHED`
   * @response `404` `void` No account exists for this phone/IIN — `ACCOUNT_NOT_FOUND`
   */
  requestOtpCreate = (data: RequestOTPBody, params: RequestParams = {}) =>
    this.request<RequestOTPResponse, void>({
      path: `/auth/request-otp`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name RegisterStartCreate
   * @summary Registration step 1 — check the identity is new and send a confirmation code
   * @request POST:/auth/register/start
   * @secure
   * @response `200` `RegisterStartResponse` Confirmation code sent
   * @response `400` `void` Invalid input — `INVALID_PHONE`, or `INSURANCE_PHONE_IS_NOT_MATCHED` when the insurance record for this IIN holds a different number
   * @response `409` `void` An account already exists — `ACCOUNT_ALREADY_EXISTS`. The user should sign in instead.
   */
  registerStartCreate = (data: RegisterStartBody, params: RequestParams = {}) =>
    this.request<RegisterStartResponse, void>({
      path: `/auth/register/start`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name RegisterVerifyOtpCreate
   * @summary Registration step 2 — verify the code and get the MIS data to pre-fill the form
   * @request POST:/auth/register/verify-otp
   * @secure
   * @response `200` `RegisterVerifyOtpResponse` Code verified
   * @response `400` `void` Invalid or expired code — `INVALID_OTP` / `OTP_EXPIRED`
   * @response `409` `void` An account already exists — `ACCOUNT_ALREADY_EXISTS`
   */
  registerVerifyOtpCreate = (data: RegisterVerifyOtpBody, params: RequestParams = {}) =>
    this.request<RegisterVerifyOtpResponse, void>({
      path: `/auth/register/verify-otp`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Creates the MIS patient when one does not exist yet, then creates the user and patient profile in a single transaction and returns a session.
   *
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
  registerCompleteCreate = (data: RegisterCompleteBody, params: RequestParams = {}) =>
    this.request<VerifyOTPResponse, void>({
      path: `/auth/register/complete`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name VerifyOtpCreate
   * @summary Verify OTP code and get authentication tokens
   * @request POST:/auth/verify-otp
   * @secure
   * @response `200` `VerifyOTPResponse` OTP verified successfully
   * @response `400` `void` Invalid or expired OTP
   * @response `404` `void` User not found
   */
  verifyOtpCreate = (data: VerifyOTPBody, params: RequestParams = {}) =>
    this.request<VerifyOTPResponse, void>({
      path: `/auth/verify-otp`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name ChangePhoneCreate
   * @summary Update authenticated user's phone number
   * @request POST:/auth/change-phone
   * @secure
   * @response `200` `ChangePhoneResponse` Phone updated
   * @response `400` `void` Invalid phone or already in use
   * @response `401` `void` Unauthorized
   */
  changePhoneCreate = (data: ChangePhoneBody, params: RequestParams = {}) =>
    this.request<ChangePhoneResponse, void>({
      path: `/auth/change-phone`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
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
  logoutCreate = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
      },
      void
    >({
      path: `/auth/logout`,
      method: 'POST',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name RefreshCreate
   * @summary Exchange a refresh token for a fresh 15-minute access token
   * @request POST:/auth/refresh
   * @secure
   * @response `200` `RefreshResponse` Session refreshed
   * @response `401` `void` Invalid, expired, revoked, or superseded refresh token
   */
  refreshCreate = (data: RefreshBody, params: RequestParams = {}) =>
    this.request<RefreshResponse, void>({
      path: `/auth/refresh`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name PostAuth
   * @summary Set or replace the authenticated user's PIN
   * @request POST:/auth/pin
   * @secure
   * @response `200` `void` PIN saved
   * @response `400` `void` Invalid PIN format
   * @response `401` `void` Unauthorized
   */
  postAuth = (data: SetPinBody, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/auth/pin`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name PinVerifyCreate
   * @summary Verify a PIN (biometric fallback) and get a fresh session
   * @request POST:/auth/pin/verify
   * @secure
   * @response `200` `RefreshResponse` PIN verified; new tokens issued
   * @response `400` `void` Invalid PIN or PIN not set
   * @response `429` `void` Too many failed attempts; PIN temporarily locked
   */
  pinVerifyCreate = (data: VerifyPinBody, params: RequestParams = {}) =>
    this.request<RefreshResponse, void>({
      path: `/auth/pin/verify`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name BiometricCreate
   * @summary Enable or disable biometric login for the authenticated user
   * @request POST:/auth/biometric
   * @secure
   * @response `200` `void` Biometric preference updated
   * @response `401` `void` Unauthorized
   */
  biometricCreate = (data: SetBiometricBody, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/auth/biometric`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name SessionsList
   * @summary List the authenticated user's login (session) history
   * @request GET:/auth/sessions
   * @secure
   * @response `200` `SessionHistoryResponse` Login history, most recent first
   * @response `401` `void` Unauthorized
   */
  sessionsList = (
    query?: {
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
    },
    params: RequestParams = {},
  ) =>
    this.request<SessionHistoryResponse, void>({
      path: `/auth/sessions`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
}
