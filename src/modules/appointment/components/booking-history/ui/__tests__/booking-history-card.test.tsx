import ReactTestRenderer from 'react-test-renderer';

import { BookingHistoryCard } from '../booking-history-card';

import type { AppointmentHistoryItem } from '@/api';

// The real ru locale, resolved down a dotted path so nested keys like
// `appointments:bookingHistory.status.CANCELLED` come back as the strings a patient reads.
jest.mock('@/shared/lib/i18n', () => {
  const ru = jest.requireActual('@/shared/lib/i18n/locales/ru.json');

  return {
    useTranslation: () => ({
      t: (key: string, vars?: Record<string, string>) => {
        const [ns, path] = key.split(':');
        const value = path
          .split('.')
          .reduce<unknown>((acc, part) => (acc as never)?.[part], ru[ns]);

        if (typeof value !== 'string') return key;

        return Object.entries(vars ?? {}).reduce(
          (text, [name, replacement]) =>
            text.replace(`{{${name}}}`, replacement),
          value,
        );
      },
    }),
  };
});

// Only the formatter is needed; the module's index pulls in navigation and screens.
jest.mock('@/modules/med-account', () =>
  jest.requireActual('@/modules/med-account/lib/format-amount'),
);

jest.mock('@/shared/icons', () => ({
  HospitalIcon: () => null,
  MapPinnedIcon: () => null,
  StethoscopeIcon: () => null,
  VideoIcon: () => null,
}));

const FUTURE = '2099-01-15T09:30:00.000Z';
const PAST = '2020-01-15T09:30:00.000Z';

const booking = (
  over: Partial<AppointmentHistoryItem>,
): AppointmentHistoryItem => ({
  id: 'appointment-1',
  externalId: 'mis-1',
  dateTime: FUTURE,
  status: 'SCHEDULED',
  isTelemedicine: false,
  doctorName: 'Иванова Анна Сергеевна',
  doctorSpecialty: 'Терапевт',
  branchName: 'Archimedes Достык',
  branchAddress: 'пр. Достык, 1',
  isForFamilyMember: false,
  paidAmount: null,
  refund: null,
  cancelledAt: null,
  createdAt: '2026-09-01T10:00:00.000Z',
  ...over,
});

const textsOf = (tree: ReactTestRenderer.ReactTestRenderer) =>
  tree.root
    .findAllByType('Text' as never)
    .map(node =>
      node.children
        .filter((child): child is string => typeof child === 'string')
        .join(''),
    )
    .filter(Boolean);

const render = (item: AppointmentHistoryItem) => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<BookingHistoryCard booking={item} />);
  });
  return textsOf(tree!);
};

describe('BookingHistoryCard', () => {
  it('shows the doctor, specialty and branch of an upcoming visit', () => {
    const texts = render(booking({}));

    expect(texts).toContain('Запланирована');
    expect(texts).toContain('Иванова Анна Сергеевна');
    expect(texts).toContain('Терапевт');
    expect(texts).toContain('Archimedes Достык, пр. Достык, 1');
    expect(texts).toContain('По страховой программе');
  });

  // The MIS sweep only re-checks the last week, so an old row can stay SCHEDULED for
  // good — the card must not call a visit from years ago "запланирована".
  it('does not call a scheduled visit whose time has passed "scheduled"', () => {
    const texts = render(booking({ dateTime: PAST }));

    expect(texts).toContain('Время прошло');
    expect(texts).not.toContain('Запланирована');
  });

  it('says a telemedicine visit is online instead of naming a branch', () => {
    const texts = render(booking({ isTelemedicine: true }));

    expect(texts).toContain('Онлайн-консультация');
    expect(texts.join(' ')).not.toContain('пр. Достык');
  });

  it('shows what was paid and where the refund of a cancelled visit is', () => {
    const texts = render(
      booking({
        status: 'CANCELLED',
        paidAmount: 10000,
        refund: {
          amount: 7000,
          feeAmount: 3000,
          status: 'PENDING',
          refundedAt: null,
        },
      }),
    );

    expect(texts).toContain('Отменена');
    expect(texts).toContain('Оплачено картой: 10 000 ₸');
    expect(texts).toContain('Возврат 7 000 ₸ — в обработке');
  });

  // The patient has been charged and the visit is gone; the card has to say where to go.
  it('points a failed refund at the call centre', () => {
    const texts = render(
      booking({
        status: 'CANCELLED',
        paidAmount: 10000,
        refund: {
          amount: 10000,
          feeAmount: 0,
          status: 'FAILED',
          refundedAt: null,
        },
      }),
    );

    expect(texts.join(' ')).toContain('обратитесь в колл-центр');
  });

  it('still renders when MIS could not name the doctor', () => {
    const texts = render(
      booking({
        doctorName: null,
        doctorSpecialty: null,
        branchName: null,
        branchAddress: null,
      }),
    );

    expect(texts).toContain('Врач не указан');
  });

  it('marks a visit booked for a family member', () => {
    const texts = render(booking({ isForFamilyMember: true }));

    expect(texts).toContain('Запись для члена семьи');
  });
});
