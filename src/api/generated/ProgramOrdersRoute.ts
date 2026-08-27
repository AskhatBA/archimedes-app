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

import { ProgramOrder, ProgramOrderAdminItem } from './data-contracts';

export namespace ProgramOrders {
  /**
 * @description Orders ("заявки") created from the paid-programs cart, newest first. An order only exists once the payment behind it settled as SUCCESS — a cart that was never paid for has no order, only a PENDING payment (see `GET /payment/pending`).
 * @tags ProgramOrders
 * @name ProgramOrdersList
 * @summary Paid-program orders placed by the authenticated user
 * @request GET:/program-orders
 * @secure
 * @response `200` `{
    success?: boolean,
    orders?: (ProgramOrder)[],

}` Orders
 * @response `401` `void` Unauthorized
*/
  export namespace ProgramOrdersList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      success?: boolean;
      orders?: ProgramOrder[];
    };
  }

  /**
 * No description
 * @tags ProgramOrders
 * @name AdminList
 * @summary Paid-program orders across all patients (dashboard)
 * @request GET:/program-orders/admin
 * @secure
 * @response `200` `{
    success?: boolean,
    items?: (ProgramOrderAdminItem)[],
    total?: number,
    page?: number,
    limit?: number,
    totalPages?: number,
    totalAmount?: number,

}` Paginated orders plus the summed total of the filtered set
 * @response `401` `void` Unauthorized
 * @response `403` `void` Not an admin
*/
  export namespace AdminList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @default 1 */
      page?: number;
      /**
       * @max 100
       * @default 20
       */
      limit?: number;
      /** Matches patient phone, full name, IIN, or a program title in the order */
      search?: string;
      status?: 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
      /** Only orders containing a program from this catalogue */
      category?: 'MED_PLAN' | 'CHECKUP';
      /** @format date */
      dateFrom?: string;
      /** @format date */
      dateTo?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      success?: boolean;
      items?: ProgramOrderAdminItem[];
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
      totalAmount?: number;
    };
  }

  /**
   * No description
   * @tags ProgramOrders
   * @name AdminDetail
   * @summary One order, unscoped (dashboard)
   * @request GET:/program-orders/admin/{id}
   * @secure
   * @response `200` `void` Order
   * @response `403` `void` Not an admin
   * @response `404` `void` Order not found
   */
  export namespace AdminDetail {
    export type RequestParams = {
      /** @format uuid */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Partial update — only the keys sent are written. Amounts and items are immutable.
   * @tags ProgramOrders
   * @name AdminPartialUpdate
   * @summary Move an order along or leave an operator note (dashboard)
   * @request PATCH:/program-orders/admin/{id}
   * @secure
   * @response `200` `void` Updated order
   * @response `400` `void` Invalid payload
   * @response `403` `void` Not an admin
   * @response `404` `void` Order not found
   */
  export namespace AdminPartialUpdate {
    export type RequestParams = {
      /** @format uuid */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = {
      status?: 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
      comment?: string | null;
    };
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
 * No description
 * @tags ProgramOrders
 * @name ProgramOrdersDetail
 * @summary One of the authenticated user's orders
 * @request GET:/program-orders/{id}
 * @secure
 * @response `200` `{
    success?: boolean,
    order?: ProgramOrder,

}` Order
 * @response `401` `void` Unauthorized
 * @response `404` `void` Order not found
*/
  export namespace ProgramOrdersDetail {
    export type RequestParams = {
      /** @format uuid */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      success?: boolean;
      order?: ProgramOrder;
    };
  }
}
