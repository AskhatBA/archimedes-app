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
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Auth<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Auth
   * @name RequestOtpCreate
   * @summary Request OTP code for phone verification
   * @request POST:/auth/request-otp
   * @secure
   * @response `200` `RequestOTPResponse` OTP code generated successfully
   * @response `400` `void` Invalid phone number format
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
