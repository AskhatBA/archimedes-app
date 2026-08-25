import { ContentType, HttpClient } from './generated/http-client';

/** What a payment is for — picks the backend handler that runs when it succeeds. */
export type PaymentPurpose = 'BALANCE_TOPUP' | 'APPOINTMENT';

/** Payment record as returned by `/payment/status/{id}`. */
export interface PaymentRecord {
  id: string;
  amount: number;
  description?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  purpose?: PaymentPurpose;
  /** Provider transaction id. */
  pgPaymentId?: string | null;
  createdAt: string;
}

export interface InitPaymentBody {
  amount: number;
  description?: string;
  purpose?: PaymentPurpose;
  /**
   * Payload for the purpose's post-success handler. The backend validates it against the
   * purpose before the payment is created, so a malformed body fails with 400 here rather
   * than after the money moved.
   */
  metadata?: Record<string, unknown>;
}

export interface InitPaymentResult {
  paymentId: string;
  /** Provider page to open in a WebView. */
  paymentUrl: string;
}

/**
 * Hand-written on purpose: the generated `Payment` client cannot be imported at all.
 * Swagger names both the client class and the response schema `Payment`, so the file
 * fails to compile with "Duplicate declaration Payment" and takes the bundle down with
 * it. Renaming that schema on the backend and re-running `npm run generate-api` would
 * make this file redundant.
 */
export class PaymentApi extends HttpClient {
  /**
   * Reads a single payment. The backend re-checks the provider for payments pending
   * longer than a minute, so this also settles the ones whose callback never arrived.
   */
  statusDetail = (id: string) =>
    this.request<PaymentRecord, void>({
      path: `/payment/status/${id}`,
      method: 'GET',
      secure: true,
      format: 'json',
    });

  /**
   * Creates a payment and returns the provider URL to open. `purpose` and `metadata`
   * decide what the backend does once the payment settles successfully.
   */
  initCreate = (body: InitPaymentBody) =>
    this.request<InitPaymentResult, void>({
      path: '/payment/init',
      method: 'POST',
      body,
      secure: true,
      type: ContentType.Json,
      format: 'json',
    });
}
