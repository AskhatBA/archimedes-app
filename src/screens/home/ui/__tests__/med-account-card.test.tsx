import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactTestRenderer from 'react-test-renderer';

import { MedAccountCard } from '../med-account-card';

const mockMedAccountList = jest.fn();
const mockNavigate = jest.fn();

jest.mock('@/api', () => ({
  insuranceApi: {
    medAccountList: () => mockMedAccountList(),
  },
}));

// The card is the way in to topping the account up, so it needs a navigator. Mocked at
// the React Navigation level rather than at `@/shared/navigation`, so the wrapper the card
// actually calls stays under test.
jest.mock('@react-navigation/native', () => ({
  useIsFocused: () => true,
  useNavigation: () => ({
    navigate: mockNavigate,
    canGoBack: () => true,
    reset: jest.fn(),
    goBack: jest.fn(),
  }),
}));

// The real hook, without the module barrel: importing it pulls in the whole insurance
// module, and with it native pickers Jest cannot transform.
jest.mock('@/modules/insurance', () => ({
  useMedAccount: jest.requireActual('@/modules/insurance/hooks/use-med-account')
    .useMedAccount,
}));

jest.mock('@/shared/icons', () => ({
  WalletIcon: () => null,
}));

// Its shimmer reads the theme through a provider this render does not set up.
jest.mock('@/shared/components/skeleton-element', () => ({
  SkeletonElement: () => null,
}));

jest.mock('@/shared/lib/i18n', () => {
  const ru = jest.requireActual('@/shared/lib/i18n/locales/ru.json');

  return {
    useTranslation: () => ({
      t: (key: string) => {
        const [ns, name] = key.split(':');
        return ru[ns]?.[name] ?? key;
      },
    }),
  };
});

/** Lets the query resolve and the card re-render with what it answered. */
const settle = () =>
  ReactTestRenderer.act(async () => {
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  });

/** Torn down after each test, or its cache timers outlive the run. */
let queryClient: QueryClient | undefined;
let rendered: ReactTestRenderer.ReactTestRenderer | undefined;

const render = async () => {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <QueryClientProvider client={queryClient}>
        <MedAccountCard />
      </QueryClientProvider>,
    );
  });

  await settle();
  rendered = tree;

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

describe('MedAccountCard', () => {
  beforeEach(() => {
    mockMedAccountList.mockReset();
    mockNavigate.mockReset();
  });

  afterEach(() => {
    ReactTestRenderer.act(() => rendered?.unmount());
    queryClient?.clear();
    rendered = undefined;
    queryClient = undefined;
  });

  it('shows the balance the insurance API served', async () => {
    mockMedAccountList.mockResolvedValue({
      data: { success: true, medAccount: { errorCode: 0, totalBalance: 0 } },
    });

    expect(textsOf(await render())).toContain('0,00 ₸');
  });

  it('groups thousands and keeps the tiyn', async () => {
    mockMedAccountList.mockResolvedValue({
      data: {
        success: true,
        medAccount: { errorCode: 0, totalBalance: 1234567.5 },
      },
    });

    expect(textsOf(await render())).toContain('1 234 567,50 ₸');
  });

  it('says unavailable when the insurance API reports its own error', async () => {
    mockMedAccountList.mockResolvedValue({
      data: { success: true, medAccount: { errorCode: 5, totalBalance: 0 } },
    });

    const texts = textsOf(await render());

    expect(texts).toContain('Недоступно');
    expect(texts).not.toContain('0,00 ₸');
  });

  it('opens the top-up screen when tapped', async () => {
    mockMedAccountList.mockResolvedValue({
      data: { success: true, medAccount: { errorCode: 0, totalBalance: 5000 } },
    });

    const tree = await render();

    ReactTestRenderer.act(() => {
      tree.root.findByProps({ accessibilityRole: 'button' }).props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('med-account-topup', undefined);
  });
});
