/** One selectable top-up amount, as the catalogue serves it. */
export interface TopupOption {
  id: string;
  /** Amount in tenge. */
  amount: number;
  /** Optional caption under the amount; hidden when empty. */
  label: string | null;
  popular: boolean;
}
