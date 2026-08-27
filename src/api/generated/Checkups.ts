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

import { CheckupItem } from './data-contracts';
import { HttpClient, RequestParams } from './http-client';

export class Checkups<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
 * No description
 *
 * @tags Checkups
 * @name CheckupsList
 * @summary Get the active check-up catalogue
 * @request GET:/checkups
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    checkups?: (CheckupItem)[],

}` Check-up catalogue
 * @response `401` `void` Unauthorized
 */
  checkupsList = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        checkups?: CheckupItem[];
      },
      void
    >({
      path: `/checkups`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
 * @tags Checkups
 * @name CheckupsDetail
 * @summary Get one check-up by id or code
 * @request GET:/checkups/{id}
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    checkup?: CheckupItem,

}` Check-up
 * @response `401` `void` Unauthorized
 * @response `404` `void` Check-up not found
 */
  checkupsDetail = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        checkup?: CheckupItem;
      },
      void
    >({
      path: `/checkups/${id}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
}
