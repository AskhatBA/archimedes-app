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
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Patient<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Patient
   * @name ProfileList
   * @summary Get patient profile
   * @request GET:/patient/profile
   * @secure
   * @response `200` `GetPatientProfileResponse` Patient profile retrieved successfully
   * @response `401` `void` Unauthorized
   */
  profileList = (params: RequestParams = {}) =>
    this.request<GetPatientProfileResponse, void>({
      path: `/patient/profile`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
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
  profileCreate = (data: CreatePatientBody, params: RequestParams = {}) =>
    this.request<
      {
        success?: boolean;
      },
      void
    >({
      path: `/patient/profile`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
