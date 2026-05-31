export type IinGender = 'M' | 'F';

interface ParsedIin {
  birthDate: string;
  gender: IinGender;
}

const CENTURY_BY_DIGIT: Record<string, string> = {
  '3': '19',
  '4': '19',
  '5': '20',
  '6': '20',
};

const FEMALE_DIGITS = ['4', '6'];

export const parseIin = (iin?: string | null): ParsedIin | null => {
  if (!iin || !/^\d{12}$/.test(iin)) return null;

  const yy = iin.slice(0, 2);
  const mm = iin.slice(2, 4);
  const dd = iin.slice(4, 6);
  const centuryDigit = iin[6];

  const century = CENTURY_BY_DIGIT[centuryDigit];
  if (!century) return null;

  const birthDate = `${century}${yy}-${mm}-${dd}`;
  const parsed = new Date(birthDate);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getUTCFullYear() !== Number(`${century}${yy}`) ||
    parsed.getUTCMonth() + 1 !== Number(mm) ||
    parsed.getUTCDate() !== Number(dd)
  ) {
    return null;
  }

  const gender: IinGender = FEMALE_DIGITS.includes(centuryDigit) ? 'F' : 'M';

  return { birthDate, gender };
};
