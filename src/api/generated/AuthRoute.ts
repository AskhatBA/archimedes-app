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
  RequestOTPBody,
  RequestOTPResponse,
  VerifyOTPBody,
  VerifyOTPResponse,
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
}
