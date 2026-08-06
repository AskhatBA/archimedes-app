import { getIinInvalidReason, isValidIin } from './validate-iin';

describe('isValidIin', () => {
  it.each([
    ['630301350211', '1963-03-01, м'],
    ['901214300123', '1990-12-14, м'],
    ['000101500011', '2000-01-01, м'],
    ['991231456789', '1999-12-31, ж'],
    ['850703409998', '1985-07-03, ж'],
    ['040229600071', '29.02.2004 — високосный год'],
  ])('принимает %s (%s)', iin => {
    expect(isValidIin(iin)).toBe(true);
  });

  it.each([
    ['12345678901', 'NOT_12_DIGITS', '11 цифр'],
    ['1234567890123', 'NOT_12_DIGITS', '13 цифр'],
    ['63030135021a', 'NOT_12_DIGITS', 'буква вместо цифры'],
    ['630301 50211', 'NOT_12_DIGITS', 'пробел внутри'],
    ['', 'NOT_12_DIGITS', 'пустая строка'],
    ['630301050211', 'INVALID_CENTURY_DIGIT', '7-я цифра = 0'],
    ['630301750211', 'INVALID_CENTURY_DIGIT', '7-я цифра = 7'],
    ['631301350212', 'INVALID_BIRTH_DATE', '13-й месяц'],
    ['630001350214', 'INVALID_BIRTH_DATE', '00-й месяц'],
    ['630230350210', 'INVALID_BIRTH_DATE', '30 февраля'],
    ['030229600074', 'INVALID_BIRTH_DATE', '29.02 невисокосного года'],
    ['500101500019', 'INVALID_BIRTH_DATE', 'дата в будущем (2050)'],
    ['630301350212', 'INVALID_CHECKSUM', 'испорчена контрольная цифра'],
    ['111111111111', 'INVALID_CHECKSUM', 'одинаковые цифры'],
  ])('отклоняет %s как %s (%s)', (iin, reason) => {
    expect(getIinInvalidReason(iin)).toBe(reason);
    expect(isValidIin(iin)).toBe(false);
  });

  it('обрезает пробелы по краям', () => {
    expect(isValidIin(' 630301350211 ')).toBe(true);
  });

  it('отклоняет пустое значение', () => {
    expect(isValidIin(undefined)).toBe(false);
    expect(isValidIin(null)).toBe(false);
  });
});
