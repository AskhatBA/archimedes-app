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
import { ContentType, HttpClient, RequestParams } from './http-client';

export class App<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags App Version
   * @name VersionList
   * @summary Get latest app version configuration
   * @request GET:/app/version
   * @secure
   * @response `200` `AppVersionResponse` Version configuration
   * @response `400` `void` Invalid platform parameter
   * @response `404` `void` No version configuration found
   */
  versionList = (
    query?: {
      /** Filter by platform */
      platform?: 'ios' | 'android';
    },
    params: RequestParams = {},
  ) =>
    this.request<AppVersionResponse, void>({
      path: `/app/version`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
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
  versionCreate = (data: CreateAppVersionBody, params: RequestParams = {}) =>
    this.request<CreateAppVersionResponse, void>({
      path: `/app/version`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
