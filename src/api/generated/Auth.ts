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

import { RequestOTPBody, RequestOTPResponse, VerifyOTPBody, VerifyOTPResponse } from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Auth<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Auth
   * @name RequestOtpCreate
   * @summary Request OTP code for phone verification
   * @request POST:/auth/request-otp
   * @response `200` `RequestOTPResponse` OTP code generated successfully
   * @response `400` `void` Invalid phone number format
   */
  requestOtpCreate = (data: RequestOTPBody, params: RequestParams = {}) =>
    this.request<RequestOTPResponse, void>({
      path: `/auth/request-otp`,
      method: 'POST',
      body: data,
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
   * @response `200` `VerifyOTPResponse` OTP verified successfully
   * @response `400` `void` Invalid or expired OTP
   * @response `404` `void` User not found
   */
  verifyOtpCreate = (data: VerifyOTPBody, params: RequestParams = {}) =>
    this.request<VerifyOTPResponse, void>({
      path: `/auth/verify-otp`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
