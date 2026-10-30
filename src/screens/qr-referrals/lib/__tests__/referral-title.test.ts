import { referralTitleOf } from '../referral-title';

const consultation = {
  id: 1,
  service: 'Консультация: Терапевт',
  amount: 10200,
};
const xray = { id: 2, service: 'Рентгенография', amount: 6000 };

describe('referralTitleOf', () => {
  it('is headed with the diagnosis when there is one', () => {
    expect(
      referralTitleOf({
        id: 7,
        diagnosis: 'Остеохондроз позвоночника',
        appointmentDetail: [xray],
      }),
    ).toBe('Остеохондроз позвоночника');
  });

  it('falls back to the service when the diagnosis is empty', () => {
    expect(
      referralTitleOf({
        id: 7,
        diagnosis: '',
        appointmentDetail: [consultation],
      }),
    ).toBe('Консультация: Терапевт');
    expect(
      referralTitleOf({
        id: 7,
        diagnosis: '  ',
        appointmentDetail: [consultation],
      }),
    ).toBe('Консультация: Терапевт');
  });

  it('folds the other services into +N', () => {
    expect(
      referralTitleOf({ id: 7, appointmentDetail: [consultation, xray] }),
    ).toBe('Консультация: Терапевт +1');
  });

  it('names the referral by number when there is nothing else', () => {
    expect(referralTitleOf({ id: 7, appointmentDetail: [] })).toBe(
      'Направление №7',
    );
    expect(referralTitleOf({})).toBe('Направление');
  });
});
