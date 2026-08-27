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

import { CheckupAdminItem, CheckupItem, CheckupWriteBody } from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

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
 * @name AdminList
 * @summary Get the whole catalogue, including unpublished entries (Admin only)
 * @request GET:/checkups/admin
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    checkups?: (CheckupAdminItem)[],

}` Check-up catalogue
 * @response `401` `void` Unauthorized
 * @response `403` `void` Forbidden — admin role required
 */
  adminList = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        checkups?: CheckupAdminItem[];
      },
      void
    >({
      path: `/checkups/admin`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
 * @tags Checkups
 * @name AdminCreate
 * @summary Create a check-up (Admin only)
 * @request POST:/checkups/admin
 * @secure
 * @response `201` `{
  \** @example true *\
    success?: boolean,
    checkup?: CheckupAdminItem,

}` Created
 * @response `400` `void` Validation error
 * @response `401` `void` Unauthorized
 * @response `403` `void` Forbidden — admin role required
 * @response `409` `void` A check-up with this code already exists
 */
  adminCreate = (data: CheckupWriteBody, params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        checkup?: CheckupAdminItem;
      },
      void
    >({
      path: `/checkups/admin`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
 * @tags Checkups
 * @name AdminPartialUpdate
 * @summary Update a check-up (Admin only)
 * @request PATCH:/checkups/admin/{id}
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    checkup?: CheckupAdminItem,

}` Updated
 * @response `400` `void` Validation error
 * @response `401` `void` Unauthorized
 * @response `403` `void` Forbidden — admin role required
 * @response `404` `void` Check-up not found
 * @response `409` `void` A check-up with this code already exists
 */
  adminPartialUpdate = (id: string, data: CheckupWriteBody, params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        checkup?: CheckupAdminItem;
      },
      void
    >({
      path: `/checkups/admin/${id}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
 * @tags Checkups
 * @name AdminDelete
 * @summary Delete a check-up (Admin only)
 * @request DELETE:/checkups/admin/{id}
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    checkup?: CheckupAdminItem,

}` Deleted
 * @response `401` `void` Unauthorized
 * @response `403` `void` Forbidden — admin role required
 * @response `404` `void` Check-up not found
 */
  adminDelete = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        checkup?: CheckupAdminItem;
      },
      void
    >({
      path: `/checkups/admin/${id}`,
      method: 'DELETE',
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
