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

export class Stats<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
 * No description
 *
 * @tags Stats
 * @name OverviewList
 * @summary Platform-wide counters for the dashboard overview (admin only)
 * @request GET:/stats/overview
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    totalPatients?: number,
    totalRefundRequests?: number,
    acceptedRefunds?: number,
    totalAppointments?: number,
    appointmentsToday?: number,

}` Counters
 * @response `401` `void` Unauthorized
 * @response `403` `void` Authenticated, but not an admin
 */
  overviewList = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        totalPatients?: number;
        totalRefundRequests?: number;
        acceptedRefunds?: number;
        totalAppointments?: number;
        appointmentsToday?: number;
      },
      void
    >({
      path: `/stats/overview`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
}
