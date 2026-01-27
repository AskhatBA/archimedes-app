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
  AvailableInsuranceCity,
  ClinicType,
  ContactInfo,
  ElectronicReferralItem,
  InsuranceFamilyResponse,
  InsuranceProgramResponse,
  InsuranceProgramsResponse,
  InsuranceRefundRequestsResponse,
  InsuranceVerifyOtpBody,
  MedicalNetworkClinics,
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
   * @name ProgramsDetail
   * @summary Get insurance program by id
   * @request GET:/insurance/programs/{programId}
   * @secure
   * @response `200` `InsuranceProgramResponse` Response
   * @response `401` `void` Unauthorized
   */
  export namespace ProgramsDetail {
    export type RequestParams = {
      /** Program ID */
      programId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = InsuranceProgramResponse;
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

  /**
 * No description
 * @tags Insurance
 * @name CitiesList
 * @summary Get list of cities from insurance service
 * @request GET:/insurance/cities
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    cities?: (AvailableInsuranceCity)[],

}` Response
 * @response `401` `void` Unauthorized
*/
  export namespace CitiesList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      cities?: AvailableInsuranceCity[];
    };
  }

  /**
 * No description
 * @tags Insurance
 * @name MedicalNetworkList
 * @summary Get list of medical network locations
 * @request GET:/insurance/medical-network
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    clinics?: (MedicalNetworkClinics)[],

}` Response
 * @response `400` `void` Bad Request - Missing required parameters
 * @response `401` `void` Unauthorized
*/
  export namespace MedicalNetworkList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** City ID */
      cityId: string;
      /** Program ID */
      programId: string;
      /** Clinic type ID */
      type?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      clinics?: MedicalNetworkClinics[];
    };
  }

  /**
 * No description
 * @tags Insurance
 * @name ElectronicReferralsList
 * @summary Get electronic referrals (appointments)
 * @request GET:/insurance/electronic-referrals
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    electronicReferrals?: (ElectronicReferralItem)[],

}` Response
 * @response `400` `void` Bad Request - Missing required parameters
 * @response `401` `void` Unauthorized
*/
  export namespace ElectronicReferralsList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Program ID */
      programId: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      electronicReferrals?: ElectronicReferralItem[];
    };
  }

  /**
 * No description
 * @tags Insurance
 * @name ContactsList
 * @summary Get insurance contact information
 * @request GET:/insurance/contacts
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    contacts?: (ContactInfo)[],

}` Response
 * @response `401` `void` Unauthorized
*/
  export namespace ContactsList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      contacts?: ContactInfo[];
    };
  }

  /**
 * No description
 * @tags Insurance
 * @name ClinicTypesList
 * @summary Get clinic types
 * @request GET:/insurance/clinic-types
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    clinicTypes?: (ClinicType)[],

}` Response
 * @response `401` `void` Unauthorized
*/
  export namespace ClinicTypesList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      clinicTypes?: ClinicType[];
    };
  }
}
