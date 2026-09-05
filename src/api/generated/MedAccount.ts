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

import {
  MedAccountOptionAdminItem,
  MedAccountOptionItem,
  MedAccountOptionWriteBody,
  MedAccountTopup,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class MedAccount<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
 * No description
 *
 * @tags MedAccount
 * @name OptionsList
 * @summary Amounts a patient can top the medical account up by
 * @request GET:/med-account/options
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    options?: (MedAccountOptionItem)[],

}` Active top-up amounts, in display order
 * @response `401` `void` Unauthorized
 */
  optionsList = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        options?: MedAccountOptionItem[];
      },
      void
    >({
      path: `/med-account/options`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
 * @tags MedAccount
 * @name OptionsAdminList
 * @summary The whole list, including unpublished amounts (Admin only)
 * @request GET:/med-account/options/admin
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    options?: (MedAccountOptionAdminItem)[],

}` Top-up amounts
 * @response `401` `void` Unauthorized
 * @response `403` `void` Forbidden — admin role required
 */
  optionsAdminList = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        options?: MedAccountOptionAdminItem[];
      },
      void
    >({
      path: `/med-account/options/admin`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags MedAccount
   * @name OptionsAdminCreate
   * @summary Add a top-up amount (Admin only)
   * @request POST:/med-account/options/admin
   * @secure
   * @response `201` `void` Created
   * @response `400` `void` Validation error
   * @response `403` `void` Forbidden — admin role required
   * @response `409` `void` This amount is already on the list
   */
  optionsAdminCreate = (data: MedAccountOptionWriteBody, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/med-account/options/admin`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags MedAccount
   * @name OptionsAdminPartialUpdate
   * @summary Update a top-up amount (Admin only)
   * @request PATCH:/med-account/options/admin/{id}
   * @secure
   * @response `200` `void` Updated
   * @response `404` `void` Amount not found
   * @response `409` `void` This amount is already on the list
   */
  optionsAdminPartialUpdate = (id: string, data: MedAccountOptionWriteBody, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/med-account/options/admin/${id}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags MedAccount
   * @name OptionsAdminDelete
   * @summary Remove a top-up amount (Admin only)
   * @request DELETE:/med-account/options/admin/{id}
   * @secure
   * @response `200` `void` Deleted
   * @response `404` `void` Amount not found
   */
  optionsAdminDelete = (id: string, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/med-account/options/admin/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags MedAccount
   * @name TopupsAdminList
   * @summary Paid top-ups awaiting or already posted to the medical account (Admin only)
   * @request GET:/med-account/topups/admin
   * @secure
   * @response `200` `void` Paginated top-ups plus the summed amount of the filtered set
   * @response `403` `void` Forbidden — admin role required
   */
  topupsAdminList = (
    query?: {
      page?: number;
      limit?: number;
      status?: 'PENDING' | 'CREDITED' | 'FAILED';
      /** Patient name, IIN or phone */
      search?: string;
      /** @example "2026-01-01" */
      dateFrom?: string;
      /** @example "2026-01-31" */
      dateTo?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/med-account/topups/admin`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description Only `status` and `comment` are writable — the amount belongs to the payment behind the top-up and is immutable. Marking a top-up CREDITED stamps `creditedAt`.
   *
   * @tags MedAccount
   * @name TopupsAdminPartialUpdate
   * @summary Move a top-up along or leave an operator note (Admin only)
   * @request PATCH:/med-account/topups/admin/{id}
   * @secure
   * @response `200` `void` Updated
   * @response `404` `void` Top-up not found
   */
  topupsAdminPartialUpdate = (
    id: string,
    data: {
      status?: 'PENDING' | 'CREDITED' | 'FAILED';
      comment?: string | null;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/med-account/topups/admin/${id}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
 * No description
 *
 * @tags MedAccount
 * @name TopupsList
 * @summary The caller's own top-up history, newest first
 * @request GET:/med-account/topups
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    topups?: (MedAccountTopup)[],

}` Top-ups
 * @response `401` `void` Unauthorized
 */
  topupsList = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        topups?: MedAccountTopup[];
      },
      void
    >({
      path: `/med-account/topups`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
}
