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

import { AppVersionResponse, CreateAppVersionBody, CreateAppVersionResponse } from './data-contracts';

export namespace App {
  /**
   * No description
   * @tags App Version
   * @name VersionList
   * @summary Get latest app version configuration
   * @request GET:/app/version
   * @secure
   * @response `200` `AppVersionResponse` Version configuration
   * @response `400` `void` Invalid platform parameter
   * @response `404` `void` No version configuration found
   */
  export namespace VersionList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Filter by platform */
      platform?: 'ios' | 'android';
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AppVersionResponse;
  }

  /**
   * No description
   * @tags App Version
   * @name VersionCreate
   * @summary Create a new app version config (Admin only)
   * @request POST:/app/version
   * @secure
   * @response `201` `CreateAppVersionResponse` Created
   * @response `400` `void` Validation error
   * @response `401` `void` Unauthorized
   * @response `403` `void` Forbidden — admin role required
   */
  export namespace VersionCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateAppVersionBody;
    export type RequestHeaders = {};
    export type ResponseBody = CreateAppVersionResponse;
  }
}
