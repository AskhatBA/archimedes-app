import { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { AppointmentsCard } from '../appointments-card';
import { ProfileCard } from '../profile-card';
import { ProgramsCard } from '../programs-card';

const mockNavigate = jest.fn();

let mockPrograms: unknown[] = [];
let mockAppointments: unknown[] = [];
let mockMedAccount: { balance: number | null; isLoading: boolean } = {
  balance: null,
  isLoading: false,
};
/** Records what the card asked for — the balance is only read for a med-account programme. */
const mockUseMedAccount = jest.fn();

jest.mock('@/shared/icons', () => ({
  ClipboardListIcon: () => null,
  SelectCaretIcon: () => null,
  ShieldPlusIcon: () => null,
  UserFilledIcon: () => null,
}));

jest.mock('@/shared/navigation', () => ({
  routes: {
    Profile: 'profile',
    Programs: 'programs',
    ProgramDetails: 'program-details',
    PaidPrograms: 'paid-programs',
    AppointmentsMain: 'appointments-main',
    CreateAppointment: 'create-appointment',
  },
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('@/shared/lib/i18n', () => {
  const ru = jest.requireActual('@/shared/lib/i18n/locales/ru.json');
  const plural = (count: number) => {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return 'one';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'few';
    return 'many';
  };

  return {
    useTranslation: () => ({
      t: (key: string, options?: Record<string, unknown>) => {
        const [ns, name] = key.split(':');
        const bundle = ru[ns] ?? {};
        const count = options?.count as number | undefined;
        const raw =
          (count !== undefined && bundle[`${name}_${plural(count)}`]) ||
          bundle[name] ||
          key;

        return Object.entries(options ?? {}).reduce(
          (acc, [token, value]) =>
            acc.split(`{{${token}}}`).join(String(value)),
          raw,
        );
      },
    }),
  };
});

jest.mock('@/modules/user', () => ({
  useUser: () => ({ user: { firstName: 'Асхат', iin: '900101300123' } }),
}));

jest.mock('@/modules/appointment/hooks/use-appointments', () => ({
  useAppointments: () => ({ appointments: mockAppointments }),
}));

jest.mock('@/modules/insurance', () => ({
  levelColors: jest.requireActual(
    '@/modules/insurance/components/program-card/constants',
  ).levelColors,
  usePrograms: () => ({ programs: mockPrograms }),
  useMedAccount: (options?: { enabled?: boolean }) => {
    mockUseMedAccount(options);
    return mockMedAccount;
  },
  formatBalance: jest.requireActual('@/modules/insurance/lib/format-balance')
    .formatBalance,
}));

const program = (
  title: string,
  cardNo: string,
  dateEnd: string,
  status = 'ACTIVE',
  isMedAccount = false,
) => ({
  id: title,
  code: title,
  title,
  cardNo,
  dateEnd,
  dateStart: '',
  status,
  isMedAccount,
});

const appointment = (
  startTime: string,
  doctorName: string,
  branchName?: string,
) => ({
  id: startTime,
  start_time: startTime,
  doctor_name: doctorName,
  branch_name: branchName,
});

const render = (Card: FC) => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<Card />);
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

const renderTexts = (Card: FC) => textsOf(render(Card));

const press = (tree: ReactTestRenderer.ReactTestRenderer, index: number) =>
  ReactTestRenderer.act(() => {
    tree.root.findAllByType(TouchableOpacity)[index].props.onPress();
  });

beforeEach(() => {
  mockPrograms = [];
  mockAppointments = [];
  mockMedAccount = { balance: null, isLoading: false };
  mockUseMedAccount.mockClear();
  mockNavigate.mockClear();
});

describe('ProfileCard', () => {
  it('shows only the user and opens the profile', () => {
    const tree = render(ProfileCard);

    expect(textsOf(tree)).toEqual(['Асхат', '900101300123']);

    press(tree, 0);
    expect(mockNavigate).toHaveBeenLastCalledWith('profile');
  });
});

describe('ProgramsCard', () => {
  it('shows a single program without a counter', () => {
    mockPrograms = [program('Standard (S134286014284810)', '', '2027-08-02')];

    expect(renderTexts(ProgramsCard)).toEqual([
      'Мои программы',
      'Standard',
      'S134286014284810',
      'Действует до 02.08.2027',
      'Показать все',
    ]);
  });

  it('shows the first active program with a +N counter', () => {
    mockPrograms = [
      program('Gold', 'S134286014284810', '2027-08-02'),
      program('Silver', 'S998877665544332', '2026-12-31'),
      program('Standard', 'S111122223333444', '2026-01-01', 'EXPIRED'),
    ];

    expect(renderTexts(ProgramsCard)).toEqual([
      'Мои программы',
      '+1',
      'Gold',
      'S134286014284810',
      'Действует до 02.08.2027',
      'Показать все',
    ]);
  });

  it('shows the med-account balance instead of the card number and end date', () => {
    mockPrograms = [
      program('Медсчет', 'S134286014284810', '2027-08-02', 'ACTIVE', true),
    ];
    mockMedAccount = { balance: 12500, isLoading: false };

    const texts = renderTexts(ProgramsCard);

    expect(texts).toContain('Баланс: 12 500,00 ₸');
    expect(texts).not.toContain('S134286014284810');
    expect(texts).not.toContain('Действует до 02.08.2027');
    expect(texts).toContain('Показать все');
    expect(mockUseMedAccount).toHaveBeenLastCalledWith({ enabled: true });
  });

  it('says the balance is unavailable when the insurer did not serve one', () => {
    mockPrograms = [
      program('Медсчет', 'S134286014284810', '2027-08-02', 'ACTIVE', true),
    ];

    expect(renderTexts(ProgramsCard)).toContain('Баланс недоступен');
  });

  it('does not read the balance for an ordinary programme', () => {
    mockPrograms = [program('Gold', 'S134286014284810', '2027-08-02')];

    renderTexts(ProgramsCard);

    expect(mockUseMedAccount).toHaveBeenLastCalledWith({ enabled: false });
  });

  it('falls back to an empty state with a CTA', () => {
    expect(renderTexts(ProgramsCard)).toEqual([
      'Мои программы',
      'Нет активных программ',
      'Подключить',
    ]);
  });

  it('opens the program itself from the card and the list from "показать все"', () => {
    mockPrograms = [
      program('Gold', 'S134286014284810', '2027-08-02'),
      program('Silver', 'S998877665544332', '2026-12-31'),
    ];

    const tree = render(ProgramsCard);

    press(tree, 0);
    expect(mockNavigate).toHaveBeenLastCalledWith('program-details', {
      programId: 'Gold',
    });

    press(tree, 1);
    expect(mockNavigate).toHaveBeenLastCalledWith('programs');
  });

  it('offers paid programs when there is no active program', () => {
    press(render(ProgramsCard), 0);

    expect(mockNavigate).toHaveBeenLastCalledWith('paid-programs');
  });
});

describe('AppointmentsCard', () => {
  it('shows a single appointment without a counter', () => {
    mockAppointments = [
      appointment('2026-09-10T14:30:00', 'Ахметов Д. С.', 'Клиника на Абая'),
    ];

    expect(renderTexts(AppointmentsCard)).toEqual([
      'Мои записи',
      '10 сентября, 14:30',
      'Ахметов Д. С.',
      'Клиника на Абая',
    ]);
  });

  it('shows the nearest appointment with a +N counter', () => {
    mockAppointments = [
      appointment('2026-09-21T09:00:00', 'Сериков Б. К.', 'Клиника на Абая'),
      appointment(
        '2026-09-10T14:30:00',
        'Ахметов Д. С.',
        'Клиника на Сейфуллина',
      ),
      appointment('2026-10-02T11:15:00', 'Нурланова А. М.', 'Клиника на Абая'),
    ];

    expect(renderTexts(AppointmentsCard)).toEqual([
      'Мои записи',
      '+2',
      '10 сентября, 14:30',
      'Ахметов Д. С.',
      'Клиника на Сейфуллина',
    ]);
  });

  it('falls back to an empty state that books an appointment', () => {
    const tree = render(AppointmentsCard);

    expect(textsOf(tree)).toEqual([
      'Мои записи',
      'Нет записей',
      'Записаться на прием',
    ]);

    press(tree, 0);
    expect(mockNavigate).toHaveBeenLastCalledWith('create-appointment');
  });

  it('opens the appointments tab when there is a visit', () => {
    mockAppointments = [appointment('2026-09-10T14:30:00', 'Ахметов Д. С.')];

    press(render(AppointmentsCard), 0);

    expect(mockNavigate).toHaveBeenLastCalledWith('appointments-main');
  });
});
