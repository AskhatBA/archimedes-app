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

import { CreateMISPatientBody, MISPatient } from './data-contracts';

export namespace Mis {
  /**
 * No description
 * @tags MIS
 * @name FindPatientList
 * @summary Find patient by phone number
 * @request GET:/mis/find-patient
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    patient?: MISPatient,

}` Patient found successfully
 * @response `401` `void` User not found or unauthorized
*/
  export namespace FindPatientList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      patient?: MISPatient;
    };
  }

  /**
 * No description
 * @tags MIS
 * @name CreatePatientCreate
 * @summary Create a new patient
 * @request POST:/mis/create-patient
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
  \** @example "Patient created" *\
    description?: string,

}` Patient created successfully
 * @response `401` `void` User not found or unauthorized
*/
  export namespace CreatePatientCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateMISPatientBody;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      /** @example "Patient created" */
      description?: string;
    };
  }
}
