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

import { CreatePatientBody, GetPatientProfileResponse } from './data-contracts';

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
}
