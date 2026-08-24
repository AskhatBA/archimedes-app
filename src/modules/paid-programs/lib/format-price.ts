/**
 * `400000` -> `400 000 ₸`.
 *
 * Grouping is done by hand rather than through `toLocaleString` — Hermes ships a
 * trimmed Intl, so the separator would differ between iOS and Android builds.
 */
export const formatPrice = (value: number): string =>
  `${Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₸`;
