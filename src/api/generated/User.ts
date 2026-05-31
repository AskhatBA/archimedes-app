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

import { HttpClient, RequestParams } from './http-client';

export class User<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
 * No description
 *
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
  checkAccountList = (
    query: {
      /**
       * 12-digit IIN
       * @minLength 12
       * @maxLength 12
       */
      iin: string;
      /** Phone number (optional, improves DB and MIS lookup) */
      phone?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        success?: boolean;
        existsInDb?: boolean;
        existsInMis?: boolean;
        existsInInsurance?: boolean;
        /** True if the provided phone matches the phone returned by the Insurance service for the given IIN */
        isPhoneMatch?: boolean;
      },
      void
    >({
      path: `/user/check-account`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
}
