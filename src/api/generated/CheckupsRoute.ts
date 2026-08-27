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
