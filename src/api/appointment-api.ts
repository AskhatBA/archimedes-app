import { HttpClient } from './generated/http-client';

/** How a cancellation right now would split the money. */
export interface AppointmentRefundPlan {
  /** What the visit cost, in tenge. */
  paidAmount: number;
  /** Share of `paidAmount` coming back — 100 inside the free window. */
  refundPercent: number;
  /** What the patient gets back, in tenge. */
  amount: number;
  /** Compensation kept by the clinic for a late cancellation. */
  feeAmount: number;
  /** Hours left until the visit, as the backend measured them. */
  hoursBefore: number;
  /** Up to this moment the cancellation is still free. */
  freeCancellationUntil: string;
}

export interface AppointmentCancellationPreview {
  appointmentId: string;
  externalId: string;
  dateTime: string;
  /** The visit was paid for by card, so cancelling owes a refund. */
  isPaid: boolean;
  /** `null` for a visit booked through an insurance programme. */
  refund: AppointmentRefundPlan | null;
}

/**
 * `PENDING` — owed but not yet reversed at FreedomPay, `COMPLETED` — on its way back to the
 * card, `FAILED` — the provider refused and an operator has to post it by hand.
 */
export type AppointmentRefundStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface AppointmentRefund extends AppointmentRefundPlan {
  id: string;
  appointmentId: string;
  status: AppointmentRefundStatus;
  comment: string | null;
  refundedAt: string | null;
  createdAt: string;
}

export interface AppointmentCancellationResult {
  appointmentId: string;
  externalId: string;
  dateTime: string;
  status: 'CANCELLED';
  /** `null` when there was no money behind the visit. */
  refund: AppointmentRefund | null;
}

/** Our own status of a visit, kept in step with MIS by the backend's status sweep. */
export type AppointmentHistoryStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

/** One visit in the patient's booking history — a row of our table, not the MIS proxy. */
export interface AppointmentHistoryItem {
  id: string;
  /** MIS id the visit is known by. */
  externalId: string;
  dateTime: string;
  status: AppointmentHistoryStatus;
  isTelemedicine: boolean;
  /** Doctor and branch are resolved from MIS and come back `null` when it is down. */
  doctorName: string | null;
  doctorSpecialty: string | null;
  branchName: string | null;
  branchAddress: string | null;
  isForFamilyMember: boolean;
  /** What was paid by card; `null` for a visit covered by an insurance programme. */
  paidAmount: number | null;
  /** Set for a cancelled paid visit. */
  refund: Pick<
    AppointmentRefund,
    'amount' | 'feeAmount' | 'status' | 'refundedAt'
  > | null;
  cancelledAt: string | null;
  createdAt: string;
}

/**
 * Backend error codes this flow can come back with, as `response.data.message`.
 *
 * The screen maps them to its own wording — the reason a cancellation was refused is
 * something the patient has to be told, not swallowed into a generic failure.
 */
export const APPOINTMENT_CANCELLATION_ERRORS = {
  notFound: 'APPOINTMENT_NOT_FOUND',
  /** Already cancelled or already completed. */
  notCancellable: 'APPOINTMENT_NOT_CANCELLABLE',
  /** The visit time has passed — the front desk closes those, not the patient. */
  alreadyStarted: 'APPOINTMENT_ALREADY_STARTED',
} as const;

/**
 * Hand-written for the same reason as `payment-api.ts`: the generated `Appointments`
 * client is produced from Swagger by `npm run generate-api`, which needs the backend
 * running, and it is not wired into `api.ts` at all — the app talks to the MIS proxy
 * routes instead. Re-running the generator makes this file redundant.
 *
 * The cancellation endpoints accept **either** our appointment id or the MIS id the app knows the
 * visit by, which matters because every list on screen is proxied live from MIS.
 */
export class AppointmentApi extends HttpClient {
  /**
   * Every visit booked through the app, newest first, cancelled ones included — read from
   * our own table, so it survives what MIS forgets.
   */
  historyList = () =>
    this.request<
      { success: boolean; appointments: AppointmentHistoryItem[] },
      void
    >({
      path: '/appointments/history',
      method: 'GET',
      secure: true,
      format: 'json',
    });

  /**
   * What cancelling would cost, without cancelling anything.
   *
   * Fails with the same 404/409 codes as the cancel itself, so a visit that can no longer
   * be cancelled says so before the patient is offered the button.
   */
  cancellationDetail = (id: string) =>
    this.request<AppointmentCancellationPreview, void>({
      path: `/appointments/${id}/cancellation`,
      method: 'GET',
      secure: true,
      format: 'json',
    });

  /**
   * Cancels the visit: removed in MIS first, then refunded if it was paid for.
   *
   * The refund is only *queued* server-side, so `refund.status` comes back `PENDING` —
   * the money reaching the card is not something this response can promise.
   */
  cancelPartialUpdate = (id: string) =>
    this.request<AppointmentCancellationResult, void>({
      path: `/appointments/${id}/cancel`,
      method: 'PATCH',
      secure: true,
      format: 'json',
    });
}
