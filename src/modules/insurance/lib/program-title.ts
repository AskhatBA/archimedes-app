const TRAILING_PARENTHESES = /\s*\(([^()]*)\)\s*$/;

/** `Standard (S134286014284810)` -> `Standard`: the insurer appends the card number to the name. */
export const getProgramTitle = (title?: string): string => {
  const raw = (title ?? '').trim();
  return raw.replace(TRAILING_PARENTHESES, '').trim() || raw;
};

/** The card number, or — when the insurer left it empty — the one in the name's parentheses. */
export const getProgramCardNo = (title?: string, cardNo?: string): string => {
  if (cardNo) return cardNo;
  return (title ?? '').trim().match(TRAILING_PARENTHESES)?.[1]?.trim() ?? '';
};
