import { TouchableOpacity } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { ProgramCard } from '../program-card';

const mockNavigate = jest.fn();
let mockMedAccount: { balance: number | null; isLoading: boolean } = {
  balance: null,
  isLoading: false,
};

jest.mock('@/shared/icons', () => ({
  SelectCaretIcon: () => null,
  ShieldPlusIcon: () => null,
}));

jest.mock('@/shared/components/skeleton-element', () => ({
  SkeletonElement: () => null,
}));

jest.mock('@/shared/navigation', () => ({
  routes: { ProgramDetails: 'program-details' },
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('@/shared/lib/i18n', () => {
  const ru = jest.requireActual('@/shared/lib/i18n/locales/ru.json');
  const lookup = (bundle: Record<string, unknown>, path: string) =>
    path
      .split('.')
      .reduce<unknown>(
        (acc, part) => (acc as Record<string, unknown> | undefined)?.[part],
        bundle,
      );

  return {
    useTranslation: () => ({
      t: (key: string, options?: Record<string, unknown>) => {
        const [ns, name] = key.split(':');
        const raw = (lookup(ru[ns] ?? {}, name) as string) ?? key;

        return Object.entries(options ?? {}).reduce(
          (acc, [token, value]) =>
            acc.split(`{{${token}}}`).join(String(value)),
          raw,
        );
      },
    }),
  };
});

jest.mock('../../../../hooks/use-med-account', () => ({
  useMedAccount: () => mockMedAccount,
}));

const render = (props: Partial<Parameters<typeof ProgramCard>[0]> = {}) => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <ProgramCard
        title="Gold"
        cardNo="S134286014284810"
        programId="42"
        dateEnd="2027-08-02"
        {...props}
      />,
    );
  });

  return tree!;
};

const textsOf = (tree: ReactTestRenderer.ReactTestRenderer) =>
  tree.root
    .findAllByType('Text' as never)
    .map(node =>
      node.children
        .filter((child): child is string => typeof child === 'string')
        .join(''),
    )
    .filter(Boolean);

beforeEach(() => {
  mockMedAccount = { balance: null, isLoading: false };
  mockNavigate.mockClear();
});

describe('ProgramCard', () => {
  it('shows the programme like the home card', () => {
    expect(textsOf(render())).toEqual([
      'Программа',
      'Gold',
      'S134286014284810',
      'Действует до 02.08.2027',
      'Подробнее',
    ]);
  });

  it('takes the card number out of the title when the insurer put it there', () => {
    const texts = textsOf(
      render({ title: 'Standard (S134286014284810)', cardNo: '' }),
    );

    expect(texts).toContain('Standard');
    expect(texts).toContain('S134286014284810');
  });

  it('shows the med-account balance instead of the card number and end date', () => {
    mockMedAccount = { balance: 12500, isLoading: false };

    const texts = textsOf(render({ title: 'Медсчет', isMedAccount: true }));

    expect(texts).toContain('Баланс: 12 500,00 ₸');
    expect(texts).not.toContain('S134286014284810');
    expect(texts).not.toContain('Действует до 02.08.2027');
  });

  it('says the balance is unavailable when the insurer did not serve one', () => {
    expect(textsOf(render({ isMedAccount: true }))).toContain(
      'Баланс недоступен',
    );
  });

  it('opens the programme details', () => {
    const tree = render();

    ReactTestRenderer.act(() => {
      tree.root.findByType(TouchableOpacity).props.onPress();
    });

    expect(mockNavigate).toHaveBeenLastCalledWith('program-details', {
      programId: '42',
    });
  });
});
