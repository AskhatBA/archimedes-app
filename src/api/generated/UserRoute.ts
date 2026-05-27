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

export namespace User {
  /**
 * No description
 * @tags User
 * @name CheckAccountList
 * @summary Check if a patient account exists in DB, MIS, and Insurance service
 * @request GET:/user/check-account
 * @secure
 * @response `200` `{
    success?: boolean,
    existsInDb?: boolean,
    existsInMis?: boolean,
    existsInInsurance?: boolean,
  \** True if the provided phone matches the phone returned by the Insurance service for the given IIN *\
    isPhoneMatch?: boolean,

}` Account check result
 * @response `400` `void` Invalid input
*/
  export namespace CheckAccountList {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * 12-digit IIN
       * @minLength 12
       * @maxLength 12
       */
      iin: string;
      /** Phone number (optional, improves DB and MIS lookup) */
      phone?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      success?: boolean;
      existsInDb?: boolean;
      existsInMis?: boolean;
      existsInInsurance?: boolean;
      /** True if the provided phone matches the phone returned by the Insurance service for the given IIN */
      isPhoneMatch?: boolean;
    };
  }
}
