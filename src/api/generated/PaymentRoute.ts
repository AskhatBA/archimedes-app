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
   * @response `400` `void` Invalid amount, unknown purpose, or metadata the purpose rejects
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
   * @description Called by FreedomPay after a payment is processed. Must stay public and unauthenticated. Verifies the request signature and the settled amount, then moves the payment out of PENDING exactly once and credits the user's balance on success. Repeated deliveries of the same result are ignored, so the balance is never credited twice. Always answers 200 with a signed XML body — outcomes are reported in `pg_status` (`ok` / `rejected` / `error`), because a non-200 makes FreedomPay retry the callback every 30 minutes for 2 hours.
   * @tags Payment
   * @name CallbackCreate
   * @summary FreedomPay server-to-server result callback (pg_result_url)
   * @request POST:/payment/callback
   * @secure
   * @response `200` `string` Signed XML acknowledgement
   */
  export namespace CallbackCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = {
      /**
       * Internal payment ID passed as pg_order_id on init
       * @format uuid
       */
      pg_order_id?: string;
      /** FreedomPay transaction ID */
      pg_payment_id?: string;
      /** 1 - success, 0 - failure, 2 - not completed yet (stays PENDING) */
      pg_result?: '0' | '1' | '2';
      /** Settled amount; must match the initiated amount */
      pg_amount?: string;
      pg_currency?: string;
      pg_payment_date?: string;
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
 * @description Everything still PENDING and still inside the provider's payment window, newest first. Each row carries the `metadata` its purpose stored at init time, which is what lets a client describe an order that does not exist anywhere else yet — an appointment being paid for is not in MIS until the payment settles.
 * @tags Payment
 * @name PendingList
 * @summary Payments the user started but has not finished
 * @request GET:/payment/pending
 * @secure
 * @response `200` `{
    payments?: ((Payment & {
    metadata?: object | null,

}))[],

}` Pending payments
 * @response `400` `void` Invalid payment purpose
 * @response `401` `void` Unauthorized
*/
  export namespace PendingList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Return only payments made for this purpose. */
      purpose?: 'BALANCE_TOPUP' | 'APPOINTMENT' | 'PAID_PROGRAM';
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      payments?: (Payment & {
        metadata?: object | null;
      })[];
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
   * @description Returns the payment record. If the payment is still PENDING more than a minute after creation, its state is re-checked against FreedomPay first — this settles payments whose result callback never arrived. Poll this endpoint after the WebView closes.
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

  /**
   * @description Ends the wait for a payment the user started and abandoned, so the client can drop the "waiting for payment" state instead of showing it until the provider's window closes. Nothing is cancelled at FreedomPay: our payments are one-step, and their `cancel` method only voids the hold of a two-step one. The provider is asked for the authoritative state first, so a payment that was in fact paid comes back `SUCCESS` (with whatever its purpose booked already done) rather than being cancelled. A cancelled payment also stays reconcilable, so a card charged just after this request still settles as `SUCCESS` later. Idempotent: cancelling an already settled payment returns it unchanged.
   * @tags Payment
   * @name CancelCreate
   * @summary Give up on a payment the payer walked away from
   * @request POST:/payment/{id}/cancel
   * @secure
   * @response `200` `Payment` The payment as it stands after the request — check `status`
   * @response `401` `void` Unauthorized
   * @response `404` `void` Payment not found, or it belongs to someone else
   */
  export namespace CancelCreate {
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
