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
  CheckUserAuthorizationResponse,
  InsuranceFamilyResponse,
  InsuranceProgramsResponse,
  InsuranceRefundRequestsResponse,
  InsuranceVerifyOtpBody,
  RefundRequestBody,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Insurance<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
 * No description
 *
 * @tags Insurance
 * @name SendOtpCreate
 * @summary Send otp to user
 * @request POST:/insurance/send-otp
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
  \** @example "OTP has been sent" *\
    message?: string,

}` OTP has been sent
 * @response `401` `void` User not found or unauthorized
 */
  sendOtpCreate = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        /** @example "OTP has been sent" */
        message?: string;
      },
      void
    >({
      path: `/insurance/send-otp`,
      method: 'POST',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
 * @tags Insurance
 * @name VerifyOtpCreate
 * @summary Verify OTP
 * @request POST:/insurance/verify-otp
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
  \** @example "OTP successfully verified" *\
    message?: string,

}` OTP successfully verified
 * @response `401` `void` User not found or unauthorized
 */
  verifyOtpCreate = (data: InsuranceVerifyOtpBody, params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        /** @example "OTP successfully verified" */
        message?: string;
      },
      void
    >({
      path: `/insurance/verify-otp`,
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
 * @tags Insurance
 * @name RefundRequestCreate
 * @summary Verify OTP
 * @request POST:/insurance/refund-request
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
  \** @example "Refund request successfully sent" *\
    message?: string,

}` Refund request successfully sent
 * @response `401` `void` User not found or unauthorized
 */
  refundRequestCreate = (data: RefundRequestBody, params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        /** @example "Refund request successfully sent" */
        message?: string;
      },
      void
    >({
      path: `/insurance/refund-request`,
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
   * @tags Insurance
   * @name CheckUserAuthorizationList
   * @summary Check if users is authorized in the insurance service successfully
   * @request GET:/insurance/check-user-authorization
   * @secure
   * @response `200` `CheckUserAuthorizationResponse` Response
   * @response `401` `void` Unauthorized
   */
  checkUserAuthorizationList = (params: RequestParams = {}) =>
    this.request<CheckUserAuthorizationResponse, void>({
      path: `/insurance/check-user-authorization`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Insurance
   * @name ProgramsList
   * @summary Get list of programs from insurance service
   * @request GET:/insurance/programs
   * @secure
   * @response `200` `InsuranceProgramsResponse` Response
   * @response `401` `void` Unauthorized
   */
  programsList = (params: RequestParams = {}) =>
    this.request<InsuranceProgramsResponse, void>({
      path: `/insurance/programs`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Insurance
   * @name FamilyList
   * @summary Get information about family members from insurance service
   * @request GET:/insurance/family
   * @secure
   * @response `200` `InsuranceFamilyResponse` Response
   * @response `401` `void` Unauthorized
   */
  familyList = (
    query: {
      /** Program ID */
      programId: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<InsuranceFamilyResponse, void>({
      path: `/insurance/family`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Insurance
   * @name RefundRequestsList
   * @summary Get list of refund requests
   * @request GET:/insurance/refund-requests
   * @secure
   * @response `200` `InsuranceRefundRequestsResponse` Response
   * @response `401` `void` Unauthorized
   */
  refundRequestsList = (params: RequestParams = {}) =>
    this.request<InsuranceRefundRequestsResponse, void>({
      path: `/insurance/refund-requests`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
}
