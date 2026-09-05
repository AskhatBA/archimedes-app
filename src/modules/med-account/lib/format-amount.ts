/**
 * `100000` -> `100 000 ₸`.
 *
 * Grouped by hand rather than through `toLocaleString`: Hermes ships a trimmed Intl, so
 * the separator would come out differently on iOS and Android.
 */
export const formatAmount = (value: number): string =>
  `${Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₸`;
