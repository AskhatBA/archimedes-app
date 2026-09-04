import { TouchableOpacity } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { ProfileCard } from '../profile-card';

const mockNavigate = jest.fn();

let mockPrograms: unknown[] = [];
let mockAppointments: unknown[] = [];

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
}));

const program = (
  title: string,
  cardNo: string,
  dateEnd: string,
  status = 'ACTIVE',
) => ({
  id: title,
  code: title,
  title,
  cardNo,
  dateEnd,
  dateStart: '',
  status,
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

const render = () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<ProfileCard />);
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

const renderTexts = () => textsOf(render());

const press = (tree: ReactTestRenderer.ReactTestRenderer, index: number) =>
  ReactTestRenderer.act(() => {
    tree.root.findAllByType(TouchableOpacity)[index].props.onPress();
  });

describe('ProfileCard stat cards', () => {
  beforeEach(() => {
    mockPrograms = [];
    mockAppointments = [];
    mockNavigate.mockClear();
  });

  it('shows a single program and a single appointment without counters', () => {
    mockPrograms = [program('Standard (S134286014284810)', '', '2027-08-02')];
    mockAppointments = [
      appointment('2026-09-10T14:30:00', 'Ахметов Д. С.', 'Клиника на Абая'),
    ];

    const texts = renderTexts();

    expect(texts).toEqual([
      'Асхат',
      '900101300123',
      'Мои программы',
      'Standard',
      'S134286014284810',
      'Действует до 02.08.2027',
      'Показать все',
      'Мои записи',
      '10 сентября, 14:30',
      'Ахметов Д. С.',
      'Клиника на Абая',
    ]);
  });

  it('shows the first program and the nearest appointment with +N counters', () => {
    mockPrograms = [
      program('Gold', 'S134286014284810', '2027-08-02'),
      program('Silver', 'S998877665544332', '2026-12-31'),
      program('Standard', 'S111122223333444', '2026-01-01', 'EXPIRED'),
    ];
    mockAppointments = [
      appointment('2026-09-21T09:00:00', 'Сериков Б. К.', 'Клиника на Абая'),
      appointment(
        '2026-09-10T14:30:00',
        'Ахметов Д. С.',
        'Клиника на Сейфуллина',
      ),
      appointment('2026-10-02T11:15:00', 'Нурланова А. М.', 'Клиника на Абая'),
    ];

    const texts = renderTexts();

    expect(texts).toEqual([
      'Асхат',
      '900101300123',
      'Мои программы',
      '+1',
      'Gold',
      'S134286014284810',
      'Действует до 02.08.2027',
      'Показать все',
      'Мои записи',
      '+2',
      '10 сентября, 14:30',
      'Ахметов Д. С.',
      'Клиника на Сейфуллина',
    ]);
  });

  it('falls back to empty states with CTAs', () => {
    const texts = renderTexts();

    expect(texts).toEqual([
      'Асхат',
      '900101300123',
      'Мои программы',
      'Нет активных программ',
      'Подключить',
      'Мои записи',
      'Нет записей',
      'Записаться на прием',
    ]);
  });

  it('opens the program itself from the card and the list from "показать все"', () => {
    mockPrograms = [
      program('Gold', 'S134286014284810', '2027-08-02'),
      program('Silver', 'S998877665544332', '2026-12-31'),
    ];

    const tree = render();
    const [, programCard, showAllLink] =
      tree.root.findAllByType(TouchableOpacity);

    ReactTestRenderer.act(() => programCard.props.onPress());
    expect(mockNavigate).toHaveBeenLastCalledWith('program-details', {
      programId: 'Gold',
    });

    ReactTestRenderer.act(() => showAllLink.props.onPress());
    expect(mockNavigate).toHaveBeenLastCalledWith('programs');
  });

  it('offers paid programs when there is no active program', () => {
    const tree = render();
    press(tree, 1);

    expect(mockNavigate).toHaveBeenLastCalledWith('paid-programs');
  });
});
