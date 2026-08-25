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

import { CreatePatientBody, GetPatientByIinResponse, GetPatientProfileResponse } from './data-contracts';

export namespace Patient {
  /**
   * No description
   * @tags Patient
   * @name ProfileList
   * @summary Get patient profile
   * @request GET:/patient/profile
   * @secure
   * @response `200` `GetPatientProfileResponse` Patient profile retrieved successfully
   * @response `401` `void` Unauthorized
   */
  export namespace ProfileList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPatientProfileResponse;
  }

  /**
 * No description
 * @tags Patient
 * @name ProfileCreate
 * @summary Create patient profile
 * @request POST:/patient/profile
 * @secure
 * @response `200` `{
    success?: boolean,

}` Patient profile created successfully
 * @response `401` `void` Unauthorized
*/
  export namespace ProfileCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreatePatientBody;
    export type RequestHeaders = {};
    export type ResponseBody = {
      success?: boolean;
    };
  }

  /**
   * No description
   * @tags Patient
   * @name ByIinDetail
   * @summary Get patient info by IIN
   * @request GET:/patient/by-iin/{iin}
   * @secure
   * @response `200` `GetPatientByIinResponse` Patient found
   * @response `401` `void` Unauthorized
   * @response `404` `void` Patient not found
   */
  export namespace ByIinDetail {
    export type RequestParams = {
      /**
       * 12-digit Kazakhstan IIN. Validated for birth date, century/gender digit and control digit.
       * @pattern ^\d{12}$
       */
      iin: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPatientByIinResponse;
  }

  /**
 * @description Paginated listing of the patient profiles stored on our side, across all users. Requires an ADMIN account — a patient's mobile token authenticates but is rejected with 403. Rows are ordered by IIN: names are encrypted at rest, so the database cannot sort them. A name search is matched after decryption and its results come back in alphabetical order.
 * @tags Patient
 * @name AdminPatientsList
 * @summary List every patient profile (dashboard, admin only)
 * @request GET:/patient/admin/patients
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    items?: ({
    id?: string,
    userId?: string,
    firstName?: string,
    lastName?: string,
    patronymic?: string,
    fullName?: string,
    birthDate?: string,
    gender?: "M" | "F",
    iin?: string,
    misPatientId?: string,
    phone?: string,
    email?: string | null,
    appointmentsCount?: number,
    refundsCount?: number,

})[],
    total?: number,
    page?: number,
    limit?: number,
    totalPages?: number,

}` A page of patients
 * @response `400` `void` Invalid pagination or filter values
 * @response `401` `void` Unauthorized
 * @response `403` `void` Authenticated, but not an admin
*/
  export namespace AdminPatientsList {
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
      /** Matches full name, IIN or phone */
      search?: string;
      gender?: 'M' | 'F';
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      items?: {
        id?: string;
        userId?: string;
        firstName?: string;
        lastName?: string;
        patronymic?: string;
        fullName?: string;
        birthDate?: string;
        gender?: 'M' | 'F';
        iin?: string;
        misPatientId?: string;
        phone?: string;
        email?: string | null;
        appointmentsCount?: number;
        refundsCount?: number;
      }[];
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };
  }
}
