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
  ClinicMO,
  ClinicType,
  ContactInfo,
  ElectronicReferralItem,
  InsuranceFamilyResponse,
  InsuranceNewsItem,
  InsuranceProgramResponse,
  InsuranceProgramsResponse,
  InsuranceRefundRequestsResponse,
  InsuranceVerifyOtpBody,
  LocalInsuranceRefundRequestsResponse,
  MedicalNetworkClinics,
  MedicServiceItem,
  PayProgramItem,
  PriceListItem,
  QrAppointmentItem,
  RefundRequestBody,
  UpdateElectronicReferralServiceStatusBody,
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
   * @name LocalRefundRequestsList
   * @summary Get list of refund requests stored in local DB for the authenticated user
   * @request GET:/insurance/local-refund-requests
   * @secure
   * @response `200` `LocalInsuranceRefundRequestsResponse` Response
   * @response `401` `void` Unauthorized
   */
  export namespace LocalRefundRequestsList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = LocalInsuranceRefundRequestsResponse;
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

  /**
 * No description
 * @tags Insurance
 * @name ElectronicReferralsServiceStatusPartialUpdate
 * @summary Update electronic referral service status
 * @request PATCH:/insurance/electronic-referrals/{electronicReferralId}/service-status
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,

}` Service status updated successfully
 * @response `401` `void` Unauthorized
 * @response `404` `void` Insurance not found in MIS
*/
  export namespace ElectronicReferralsServiceStatusPartialUpdate {
    export type RequestParams = {
      /** Electronic referral ID */
      electronicReferralId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateElectronicReferralServiceStatusBody;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
    };
  }

  /**
 * No description
 * @tags Insurance
 * @name QrAppointmentsList
 * @summary Get QR appointments for a clinic
 * @request GET:/insurance/qr/appointments
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    data?: (QrAppointmentItem)[],

}` Response
*/
  export namespace QrAppointmentsList {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Clinic ID (GUID)
       * @format uuid
       */
      clinicId: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      data?: QrAppointmentItem[];
    };
  }

  /**
 * No description
 * @tags Insurance
 * @name QrSubmitAppointmentList
 * @summary Submit a QR appointment
 * @request GET:/insurance/qr/submit-appointment
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    data?: object,

}` Response
 * @response `400` `void` appCode is required
*/
  export namespace QrSubmitAppointmentList {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Clinic ID (GUID)
       * @format uuid
       */
      clinicId: string;
      /** Appointment code */
      appCode: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      data?: object;
    };
  }

  /**
 * No description
 * @tags Insurance
 * @name CheckIinList
 * @summary Check if IIN is registered in the insurance service
 * @request GET:/insurance/check-iin
 * @secure
 * @response `200` `{
  \** @example 0 *\
    errorCode: number,
  \** @example "77772114452" *\
    phone?: string,
  \** @example "Пользователь не найден" *\
    message?: string,

}` IIN check result
 * @response `401` `void` User not found or unauthorized
*/
  export namespace CheckIinList {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * 12-digit Kazakhstan IIN. Validated for birth date, century/gender digit and control digit.
       * @pattern ^\d{12}$
       */
      iin: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example 0 */
      errorCode: number;
      /** @example "77772114452" */
      phone?: string;
      /** @example "Пользователь не найден" */
      message?: string;
    };
  }

  /**
 * No description
 * @tags Insurance
 * @name NewsList
 * @summary Get list of news from insurance service
 * @request GET:/insurance/news
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    news?: (InsuranceNewsItem)[],

}` Response
*/
  export namespace NewsList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      news?: InsuranceNewsItem[];
    };
  }

  /**
 * No description
 * @tags Insurance
 * @name ClinicsMoList
 * @summary Get list of MO clinics
 * @request GET:/insurance/clinics-mo
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    clinicsMO?: (ClinicMO)[],

}` Response
 * @response `401` `void` Unauthorized
 * @response `404` `void` Insurance not found in MIS
*/
  export namespace ClinicsMoList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      clinicsMO?: ClinicMO[];
    };
  }

  /**
 * No description
 * @tags Insurance
 * @name PriceListList
 * @summary Get price list for a clinic
 * @request GET:/insurance/price-list
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    priceList?: (PriceListItem)[],

}` Response
 * @response `400` `void` clinicId is required
 * @response `401` `void` Unauthorized
 * @response `404` `void` Insurance not found in MIS
*/
  export namespace PriceListList {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Clinic OID (from getClinicsMO)
       * @format uuid
       */
      clinicId: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      priceList?: PriceListItem[];
    };
  }

  /**
 * No description
 * @tags Insurance
 * @name MedicServiceList
 * @summary Get services provided by a doctor in a clinic
 * @request GET:/insurance/medic-service
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    medicService?: MedicServiceItem,

}` Response
 * @response `400` `void` clinicId or medicIIN is required
 * @response `401` `void` Unauthorized
 * @response `404` `void` Insurance not found in MIS
*/
  export namespace MedicServiceList {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Clinic OID (from getClinicsMO)
       * @format uuid
       */
      clinicId: string;
      /**
       * Doctor IIN
       * @example "123456789012"
       */
      medicIIN: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      medicService?: MedicServiceItem;
    };
  }

  /**
 * No description
 * @tags Insurance
 * @name PayProgramsList
 * @summary Get list of paid insurance programs available for purchase
 * @request GET:/insurance/pay-programs
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    payPrograms?: (PayProgramItem)[],

}` Response
 * @response `401` `void` Unauthorized
 * @response `404` `void` Insurance not found in MIS
*/
  export namespace PayProgramsList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      payPrograms?: PayProgramItem[];
    };
  }

  /**
 * @description Paginated listing of the refund requests stored on our side, across all users. Requires an ADMIN account — a patient's mobile token authenticates but is rejected with 403.
 * @tags Insurance
 * @name AdminRefundRequestsList
 * @summary List every refund request (dashboard, admin only)
 * @request GET:/insurance/admin/refund-requests
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    items?: ({
    id?: string,
    patientName?: string | null,
    patientIin?: string | null,
    patientPhone?: string,
    category?: number,
    amount?: number,
    date?: string,
    comments?: string | null,
    filesCount?: number,
    state?: "accepted" | "failed" | "unknown",
    createdAt?: string,

})[],
    total?: number,
    page?: number,
    limit?: number,
    totalPages?: number,
    totalAmount?: number,

}` A page of refund requests
 * @response `400` `void` Invalid pagination or filter values
 * @response `401` `void` Unauthorized
 * @response `403` `void` Authenticated, but not an admin
*/
  export namespace AdminRefundRequestsList {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * @min 1
       * @default 1
       */
      page?: number;
      /**
       * @min 1
       * @max 100
       * @default 20
       */
      limit?: number;
      /** Matches patient full name, IIN or phone */
      search?: string;
      category?: 0 | 2 | 4 | 5;
      /** Claim date lower bound, inclusive (YYYY-MM-DD) */
      dateFrom?: string;
      /** Claim date upper bound, inclusive (YYYY-MM-DD) */
      dateTo?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      items?: {
        id?: string;
        patientName?: string | null;
        patientIin?: string | null;
        patientPhone?: string;
        category?: number;
        amount?: number;
        date?: string;
        comments?: string | null;
        filesCount?: number;
        state?: 'accepted' | 'failed' | 'unknown';
        createdAt?: string;
      }[];
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
      totalAmount?: number;
    };
  }
}
