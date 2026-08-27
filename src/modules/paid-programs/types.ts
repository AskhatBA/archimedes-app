/** Which tab a paid program belongs to. */
export type PaidProgramCategory = 'MED_PLAN' | 'CHECKUP';

/** Whom the program covers — drives the card icon and the coverage chip. */
export type PaidProgramCoverage = 'PERSONAL' | 'FAMILY';

export interface PaidProgram {
  id: string;
  category: PaidProgramCategory;
  /** Program code — `M2` for a MIS med plan, a slug like `thyroid` for a check-up. */
  code?: string;
  /** Absent when the source has no coverage information — the chip is then hidden. */
  coverage?: PaidProgramCoverage;
  /** Comes from the backend already localized, so it is not part of the i18n bundles. */
  title: string;
  /** Price in tenge. */
  price: number;
  description: string;
  /** How long the program stays active, e.g. "12 месяцев". Hidden when unknown. */
  duration?: string;
  /** What the program includes — rendered as a checklist in the details drawer. */
  services: string[];
  /** Highlighted with a badge in the list. */
  popular?: boolean;
}

/**
 * Mirrors the backend's `Payment.status` enum — a purchase is only as settled as the
 * payment behind it.
 */
export type PurchaseStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface Purchase {
  /** Local record id, created before the payment page hands back a payment id. */
  id: string;
  /** ISO timestamp of the moment checkout started. */
  createdAt: string;
  /** Snapshot of what was bought — prices and titles must not drift with the catalogue. */
  programs: PaidProgram[];
  total: number;
  status: PurchaseStatus;
  /** Backend payment id, known once the payment page reports a result. */
  paymentId?: string;
}
