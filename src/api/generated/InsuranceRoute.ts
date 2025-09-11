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

export namespace Insurance {
  /**
 * No description
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
  export namespace SendOtpCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      /** @example "OTP has been sent" */
      message?: string;
    };
  }

  /**
 * No description
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
  export namespace VerifyOtpCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = InsuranceVerifyOtpBody;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      /** @example "OTP successfully verified" */
      message?: string;
    };
  }

  /**
 * No description
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
  export namespace RefundRequestCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RefundRequestBody;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      /** @example "Refund request successfully sent" */
      message?: string;
    };
  }

  /**
   * No description
   * @tags Insurance
   * @name CheckUserAuthorizationList
   * @summary Check if users is authorized in the insurance service successfully
   * @request GET:/insurance/check-user-authorization
   * @secure
   * @response `200` `CheckUserAuthorizationResponse` Response
   * @response `401` `void` Unauthorized
   */
  export namespace CheckUserAuthorizationList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckUserAuthorizationResponse;
  }

  /**
   * No description
   * @tags Insurance
   * @name ProgramsList
   * @summary Get list of programs from insurance service
   * @request GET:/insurance/programs
   * @secure
   * @response `200` `InsuranceProgramsResponse` Response
   * @response `401` `void` Unauthorized
   */
  export namespace ProgramsList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = InsuranceProgramsResponse;
  }

  /**
   * No description
   * @tags Insurance
   * @name FamilyList
   * @summary Get information about family members from insurance service
   * @request GET:/insurance/family
   * @secure
   * @response `200` `InsuranceFamilyResponse` Response
   * @response `401` `void` Unauthorized
   */
  export namespace FamilyList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Program ID */
      programId: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = InsuranceFamilyResponse;
  }

  /**
   * No description
   * @tags Insurance
   * @name RefundRequestsList
   * @summary Get list of refund requests
   * @request GET:/insurance/refund-requests
   * @secure
   * @response `200` `InsuranceRefundRequestsResponse` Response
   * @response `401` `void` Unauthorized
   */
  export namespace RefundRequestsList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = InsuranceRefundRequestsResponse;
  }
}
