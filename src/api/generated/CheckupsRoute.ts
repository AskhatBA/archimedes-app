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

export namespace Checkups {
  /**
 * No description
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
  export namespace CheckupsList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      checkups?: CheckupItem[];
    };
  }

  /**
 * No description
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
  export namespace AdminList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      checkups?: CheckupAdminItem[];
    };
  }

  /**
 * No description
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
  export namespace AdminCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CheckupWriteBody;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      checkup?: CheckupAdminItem;
    };
  }

  /**
 * No description
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
  export namespace AdminPartialUpdate {
    export type RequestParams = {
      /** @format uuid */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = CheckupWriteBody;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      checkup?: CheckupAdminItem;
    };
  }

  /**
 * No description
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
  export namespace AdminDelete {
    export type RequestParams = {
      /** @format uuid */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      checkup?: CheckupAdminItem;
    };
  }

  /**
 * No description
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
  export namespace CheckupsDetail {
    export type RequestParams = {
      /** Check-up uuid or its stable code */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      checkup?: CheckupItem;
    };
  }
}
