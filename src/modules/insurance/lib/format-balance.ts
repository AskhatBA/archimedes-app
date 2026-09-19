/**
 * `0` -> `0,00 ₸`. Grouped by hand for the same reason as `formatPrice`: Hermes ships a
 * trimmed Intl, so `toLocaleString` would format differently on iOS and Android.
 */
export const formatBalance = (value: number): string => {
  const [whole, cents] = Math.abs(value).toFixed(2).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return `${value < 0 ? '-' : ''}${grouped},${cents} ₸`;
};
