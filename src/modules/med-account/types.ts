/** One selectable top-up amount, as the catalogue serves it. */
export interface TopupOption {
  id: string;
  /** Amount in tenge. */
  amount: number;
  /** Optional caption under the amount; hidden when empty. */
  label: string | null;
  popular: boolean;
}

/**
 * How far a paid top-up has got on its way onto the medical account.
 *
 * The account itself lives in the insurer's system, so a settled payment is not the end of
 * the story — `CREDITED` is, and until then the money is paid for but not yet spendable.
 */
export type TopupStatus = 'PENDING' | 'CREDITED' | 'FAILED';

/** One of the patient's own top-ups, as `GET /med-account/topups` returns it. */
export interface Topup {
  id: string;
  /** Amount in tenge. */
  amount: number;
  status: TopupStatus;
  /** When the money reached the medical account; null until it has. */
  creditedAt: string | null;
  createdAt: string;
}
