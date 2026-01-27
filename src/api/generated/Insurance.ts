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
   * @name ProgramsDetail
   * @summary Get insurance program by id
   * @request GET:/insurance/programs/{programId}
   * @secure
   * @response `200` `InsuranceProgramResponse` Response
   * @response `401` `void` Unauthorized
   */
  programsDetail = (programId: string, params: RequestParams = {}) =>
    this.request<InsuranceProgramResponse, void>({
      path: `/insurance/programs/${programId}`,
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
  /**
 * No description
 *
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
  citiesList = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        cities?: AvailableInsuranceCity[];
      },
      void
    >({
      path: `/insurance/cities`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
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
  medicalNetworkList = (
    query: {
      /** City ID */
      cityId: string;
      /** Program ID */
      programId: string;
      /** Clinic type ID */
      type?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        clinics?: MedicalNetworkClinics[];
      },
      void
    >({
      path: `/insurance/medical-network`,
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
  electronicReferralsList = (
    query: {
      /** Program ID */
      programId: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        electronicReferrals?: ElectronicReferralItem[];
      },
      void
    >({
      path: `/insurance/electronic-referrals`,
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
  contactsList = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        contacts?: ContactInfo[];
      },
      void
    >({
      path: `/insurance/contacts`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
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
  clinicTypesList = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        clinicTypes?: ClinicType[];
      },
      void
    >({
      path: `/insurance/clinic-types`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
}
