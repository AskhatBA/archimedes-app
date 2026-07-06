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

import { InitPaymentBody, InitPaymentResponse, Payment } from './data-contracts';

export namespace Payment {
  /**
   * @description Creates a payment record and returns the FreedomPay redirect URL. Open this URL in a WebView to let the user complete the payment.
   * @tags Payment
   * @name InitCreate
   * @summary Initiate a balance replenishment payment
   * @request POST:/payment/init
   * @secure
   * @response `200` `InitPaymentResponse` Payment initiated successfully
   * @response `400` `void` Invalid amount
   * @response `401` `void` Unauthorized
   * @response `502` `void` FreedomPay rejected the payment request
   */
  export namespace InitCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = InitPaymentBody;
    export type RequestHeaders = {};
    export type ResponseBody = InitPaymentResponse;
  }

  /**
   * @description Called by FreedomPay after a payment is processed. Verifies the request signature, updates the payment status, and increments the user's balance on success. Returns a signed XML acknowledgement.
   * @tags Payment
   * @name CallbackCreate
   * @summary FreedomPay server-to-server result callback
   * @request POST:/payment/callback
   * @secure
   * @response `200` `string` Signed XML acknowledgement
   * @response `400` `void` Invalid signature or missing payment
   */
  export namespace CallbackCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = {
      /** @format uuid */
      pg_order_id?: string;
      pg_payment_id?: string;
      pg_status?: 'ok' | 'error' | 'rejected';
      pg_amount?: string;
      pg_currency?: string;
      pg_salt?: string;
      pg_sig?: string;
    };
    export type RequestHeaders = {};
    export type ResponseBody = string;
  }

  /**
 * @description FreedomPay redirects the user here after a successful payment. The WebView detects this URL and closes.
 * @tags Payment
 * @name SuccessList
 * @summary Payment success redirect target
 * @request GET:/payment/success
 * @secure
 * @response `200` `{
  \** @example "success" *\
    status?: string,

}` Payment success indicator
*/
  export namespace SuccessList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example "success" */
      status?: string;
    };
  }

  /**
 * @description FreedomPay redirects the user here after a failed or cancelled payment. The WebView detects this URL and closes.
 * @tags Payment
 * @name FailureList
 * @summary Payment failure redirect target
 * @request GET:/payment/failure
 * @secure
 * @response `200` `{
  \** @example "failed" *\
    status?: string,

}` Payment failure indicator
*/
  export namespace FailureList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example "failed" */
      status?: string;
    };
  }

  /**
 * No description
 * @tags Payment
 * @name BalanceList
 * @summary Get the authenticated user's balance
 * @request GET:/payment/balance
 * @secure
 * @response `200` `{
  \** @example 15000 *\
    balance?: number,

}` Current balance in KZT
 * @response `401` `void` Unauthorized
*/
  export namespace BalanceList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example 15000 */
      balance?: number;
    };
  }

  /**
   * No description
   * @tags Payment
   * @name HistoryList
   * @summary Get payment history for the authenticated user
   * @request GET:/payment/history
   * @secure
   * @response `200` `(Payment)[]` List of payments ordered by date descending
   * @response `401` `void` Unauthorized
   */
  export namespace HistoryList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Payment[];
  }

  /**
   * No description
   * @tags Payment
   * @name StatusDetail
   * @summary Get a single payment by ID
   * @request GET:/payment/status/{id}
   * @secure
   * @response `200` `Payment` Payment record
   * @response `401` `void` Unauthorized
   * @response `404` `void` Payment not found
   */
  export namespace StatusDetail {
    export type RequestParams = {
      /**
       * Internal payment ID returned by /payment/init
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Payment;
  }
}
