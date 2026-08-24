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
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Payment<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Creates a payment record and returns the FreedomPay redirect URL. Open this URL in a WebView to let the user complete the payment.
   *
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
  initCreate = (data: InitPaymentBody, params: RequestParams = {}) =>
    this.request<InitPaymentResponse, void>({
      path: `/payment/init`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Called by FreedomPay after a payment is processed. Must stay public and unauthenticated. Verifies the request signature and the settled amount, then moves the payment out of PENDING exactly once and credits the user's balance on success. Repeated deliveries of the same result are ignored, so the balance is never credited twice. Always answers 200 with a signed XML body — outcomes are reported in `pg_status` (`ok` / `rejected` / `error`), because a non-200 makes FreedomPay retry the callback every 30 minutes for 2 hours.
   *
   * @tags Payment
   * @name CallbackCreate
   * @summary FreedomPay server-to-server result callback (pg_result_url)
   * @request POST:/payment/callback
   * @secure
   * @response `200` `string` Signed XML acknowledgement
   */
  callbackCreate = (
    data: {
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
    },
    params: RequestParams = {},
  ) =>
    this.request<string, any>({
      path: `/payment/callback`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.UrlEncoded,
      ...params,
    });
  /**
 * @description FreedomPay redirects the user here after a successful payment. The WebView detects this URL and closes.
 *
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
  successList = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example "success" */
        status?: string;
      },
      any
    >({
      path: `/payment/success`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * @description FreedomPay redirects the user here after a failed or cancelled payment. The WebView detects this URL and closes.
 *
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
  failureList = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example "failed" */
        status?: string;
      },
      any
    >({
      path: `/payment/failure`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
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
  balanceList = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example 15000 */
        balance?: number;
      },
      void
    >({
      path: `/payment/balance`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Payment
   * @name HistoryList
   * @summary Get payment history for the authenticated user
   * @request GET:/payment/history
   * @secure
   * @response `200` `(Payment)[]` List of payments ordered by date descending
   * @response `401` `void` Unauthorized
   */
  historyList = (params: RequestParams = {}) =>
    this.request<Payment[], void>({
      path: `/payment/history`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Returns the payment record. If the payment is still PENDING more than a minute after creation, its state is re-checked against FreedomPay first — this settles payments whose result callback never arrived. Poll this endpoint after the WebView closes.
   *
   * @tags Payment
   * @name StatusDetail
   * @summary Get a single payment by ID
   * @request GET:/payment/status/{id}
   * @secure
   * @response `200` `Payment` Payment record
   * @response `401` `void` Unauthorized
   * @response `404` `void` Payment not found
   */
  statusDetail = (id: string, params: RequestParams = {}) =>
    this.request<Payment, void>({
      path: `/payment/status/${id}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
}
