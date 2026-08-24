import { HttpClient } from './generated/http-client';

/** Payment record as returned by `/payment/status/{id}`. */
export interface PaymentRecord {
  id: string;
  amount: number;
  description?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  /** Provider transaction id. */
  pgPaymentId?: string | null;
  createdAt: string;
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
}
