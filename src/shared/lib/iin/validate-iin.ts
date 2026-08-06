/**
 * Kazakhstan IIN (ИИН/ЖСН) validation — mirrors the backend check in
 * `src/shared/services/iin.service.ts` so the user sees the error while typing
 * instead of after a round trip.
 */

const IIN_REGEX = /^\d{12}$/;

/**
 * The 7th digit encodes both century of birth and gender:
 * 1/2 — 1800s, 3/4 — 1900s, 5/6 — 2000s (odd = male, even = female).
 */
const CENTURY_BY_SEVENTH_DIGIT: Record<number, number> = {
  1: 1800,
  2: 1800,
  3: 1900,
  4: 1900,
  5: 2000,
  6: 2000,
};

// Control-digit weights defined by the RK standard. The second set is used only
// when the first pass yields a remainder of 10.
const PRIMARY_WEIGHTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const FALLBACK_WEIGHTS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2];

export type IinInvalidReason =
  | 'NOT_12_DIGITS'
  | 'INVALID_CENTURY_DIGIT'
  | 'INVALID_BIRTH_DATE'
  | 'INVALID_CHECKSUM';

const weightedRemainder = (digits: number[], weights: number[]): number =>
  weights.reduce((sum, weight, index) => sum + digits[index] * weight, 0) % 11;

const hasValidBirthDate = (digits: number[]): boolean => {
  const century = CENTURY_BY_SEVENTH_DIGIT[digits[6]];
  const year = century + digits[0] * 10 + digits[1];
  const month = digits[2] * 10 + digits[3];
  const day = digits[4] * 10 + digits[5];

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  // Round-tripping through Date catches overflow dates such as 31 February.
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return false;
  }

  return date.getTime() <= Date.now();
};

const hasValidChecksum = (digits: number[]): boolean => {
  const controlDigit = digits[11];
  const payload = digits.slice(0, 11);

  let remainder = weightedRemainder(payload, PRIMARY_WEIGHTS);

  if (remainder === 10) {
    remainder = weightedRemainder(payload, FALLBACK_WEIGHTS);
  }

  // A remainder of 10 in both passes means no valid IIN can end in that sequence.
  if (remainder === 10) {
    return false;
  }

  return remainder === controlDigit;
};

/**
 * Returns `null` when the value is a well-formed IIN, otherwise the reason it
 * was rejected.
 */
export const getIinInvalidReason = (
  value?: string | null,
): IinInvalidReason | null => {
  const iin = (value || '').trim();

  if (!IIN_REGEX.test(iin)) {
    return 'NOT_12_DIGITS';
  }

  const digits = iin.split('').map(Number);

  if (!CENTURY_BY_SEVENTH_DIGIT[digits[6]]) {
    return 'INVALID_CENTURY_DIGIT';
  }

  if (!hasValidBirthDate(digits)) {
    return 'INVALID_BIRTH_DATE';
  }

  if (!hasValidChecksum(digits)) {
    return 'INVALID_CHECKSUM';
  }

  return null;
};

export const isValidIin = (value?: string | null): boolean =>
  getIinInvalidReason(value) === null;
