import ReactTestRenderer from 'react-test-renderer';

import { TopupHistoryCard } from '../topup-history-card';

import type { Topup } from '../../types';

// The real ru locale, resolved down a dotted path so nested keys like
// `medAccount:history.status.PENDING` come back as the strings a patient actually reads.
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

const topup = (over: Partial<Topup>): Topup => ({
  id: 'topup-1',
  amount: 100000,
  status: 'PENDING',
  creditedAt: null,
  createdAt: '2026-09-05T10:15:00.000Z',
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

const render = (item: Topup) => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<TopupHistoryCard topup={item} />);
  });
  return textsOf(tree!);
};

describe('TopupHistoryCard', () => {
  it('groups the amount and shows the paid-at date', () => {
    const texts = render(topup({ amount: 1234567 }));

    expect(texts).toContain('1 234 567 ₸');
    expect(texts.some(text => text.startsWith('05.09.2026'))).toBe(true);
  });

  it('explains that a pending top-up has been paid for but not yet posted', () => {
    const texts = render(topup({ status: 'PENDING' }));

    expect(texts).toContain('Зачисляется');
    expect(texts.join(' ')).toContain('Оплата прошла');
  });

  it('names the day a credited top-up landed', () => {
    const texts = render(
      topup({ status: 'CREDITED', creditedAt: '2026-09-06T08:00:00.000Z' }),
    );

    expect(texts).toContain('Зачислено');
    expect(texts.join(' ')).toContain('06.09.2026');
  });

  // The patient has been charged and cannot fix it from the app, so the card has to say
  // where to go — a bare "не зачислено" would be a dead end.
  it('points a failed top-up at support', () => {
    const texts = render(topup({ status: 'FAILED' }));

    expect(texts).toContain('Не зачислено');
    expect(texts.join(' ')).toContain('поддержку');
  });

  it('falls back to the generic credited copy when the date is missing', () => {
    const texts = render(topup({ status: 'CREDITED', creditedAt: null }));

    expect(texts).toContain('Зачислено');
    expect(texts.join(' ')).toContain('Деньги на медсчёте');
  });
});
