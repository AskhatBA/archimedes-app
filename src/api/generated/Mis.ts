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
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Mis<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
 * No description
 *
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
  findPatientList = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        patient?: MISPatient;
      },
      void
    >({
      path: `/mis/find-patient`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
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
  createPatientCreate = (data: CreateMISPatientBody, params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        /** @example "Patient created" */
        description?: string;
      },
      void
    >({
      path: `/mis/create-patient`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
