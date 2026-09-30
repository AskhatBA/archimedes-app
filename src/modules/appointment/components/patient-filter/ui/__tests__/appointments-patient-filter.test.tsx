import { Text, TouchableOpacity } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { FamilyMember } from '../../../../lib/family-members';
import { AppointmentsPatient } from '../../../../types';
import { AppointmentsPatientFilter } from '../appointments-patient-filter';

let mockFamily: {
  members: FamilyMember[];
  programTitles: string[];
  isLoading: boolean;
} = { members: [], programTitles: [], isLoading: false };

jest.mock('../../../../hooks/use-family-members', () => ({
  useFamilyMembers: () => mockFamily,
}));

jest.mock('@/shared/components/bottom-drawer', () => ({
  BottomDrawer: ({
    visible,
    children,
  }: {
    visible: boolean;
    children: React.ReactNode;
  }) => (visible ? children : null),
}));

jest.mock('@/shared/icons', () => ({
  CloseIcon: () => null,
  FamilyIcon: () => null,
  SelectCaretIcon: () => null,
  SelectIndicator: () => null,
  UserFilledIcon: () => null,
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
        const [ns, path] = key.split(':');
        const parts = path.split('.');
        const name = parts.pop() as string;
        const bundle = parts.reduce<Record<string, string>>(
          (node, part) => node?.[part] as never,
          ru[ns],
        );
        const count = options?.count as number | undefined;
        const raw =
          (count !== undefined && bundle?.[`${name}_${plural(count)}`]) ||
          bundle?.[name] ||
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

const member = (
  benId: string,
  fullName: string,
  birthDate: string | null = '2014-03-12',
  relationship = 'Ребенок',
): FamilyMember => ({
  benId,
  fullName,
  relationship,
  birthDate,
  programId: 'gold',
});

const son = member('son', 'Сидоров Пётр Иванович');
const daughter = member('daughter', 'Сидорова Анна Ивановна', '2019-06-01');
const wife = member(
  'wife',
  'Сидорова Мария Петровна',
  '1988-10-01',
  'Супруг(а)',
);
const mother = member('mother', 'Ахметова Сауле Касымовна', null, 'Мать');

const render = (value: AppointmentsPatient = {}) => {
  const onChange = jest.fn();
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <AppointmentsPatientFilter value={value} onChange={onChange} />,
    );
  });

  return { tree: tree!, onChange };
};

const textsOf = (tree: ReactTestRenderer.ReactTestRenderer) =>
  tree.root
    .findAllByType(Text)
    .map(node => [node.props.children].flat().join(''))
    .filter(Boolean);

const touchables = (tree: ReactTestRenderer.ReactTestRenderer, role: string) =>
  tree.root
    .findAllByType(TouchableOpacity)
    .filter(node => node.props.accessibilityRole === role);

const openSheet = (tree: ReactTestRenderer.ReactTestRenderer) =>
  ReactTestRenderer.act(() => {
    touchables(tree, 'button')[0].props.onPress();
  });

const options = (tree: ReactTestRenderer.ReactTestRenderer) =>
  touchables(tree, 'radio');

describe('AppointmentsPatientFilter', () => {
  beforeEach(() => {
    mockFamily = {
      members: [son, daughter],
      programTitles: ['Gold', 'Мед. счёт'],
      isLoading: false,
    };
  });

  it('renders nothing when there is nobody to switch to', () => {
    mockFamily = { members: [], programTitles: ['Gold'], isLoading: false };

    const { tree } = render();

    expect(tree.toJSON()).toBeNull();
  });

  it('starts collapsed on the own list, showing the family as faces', () => {
    const { tree } = render();

    expect(textsOf(tree)).toEqual([
      'Мои записи',
      'Посмотреть записи близких',
      'СП',
      'СА',
    ]);
    expect(options(tree)).toHaveLength(0);
  });

  it('folds a big family into +N after three faces', () => {
    mockFamily.members = [son, daughter, wife, mother];

    const { tree } = render();

    expect(textsOf(tree)).toEqual([
      'Мои записи',
      'Посмотреть записи близких',
      'СП',
      'СА',
      'СМ',
      '+1',
    ]);
  });

  it('lists the patient and every relative once in the sheet', () => {
    mockFamily.members = [son, mother];

    const { tree } = render();
    openSheet(tree);

    expect(
      options(tree).map(option => option.props.accessibilityState),
    ).toEqual([{ checked: true }, { checked: false }, { checked: false }]);
    expect(textsOf(tree)).toEqual(
      expect.arrayContaining([
        'Чьи записи показать',
        'Записи близких из ваших страховых программ',
        'Ваши собственные записи',
        'Сидоров Пётр Иванович',
        'Ребенок · 12.03.2014',
        'Ахметова Сауле Касымовна',
        // No birth date — the relationship alone.
        'Мать',
        'Программы: Gold, Мед. счёт',
      ]),
    );
  });

  it('picks a relative with their programme in one tap and closes', () => {
    const { tree, onChange } = render();
    openSheet(tree);

    ReactTestRenderer.act(() => {
      options(tree)[2].props.onPress();
    });

    expect(onChange).toHaveBeenCalledWith({
      programId: 'gold',
      familyMemberId: 'daughter',
    });
    expect(options(tree)).toHaveLength(0);
  });

  it('does not report a pick that changes nothing', () => {
    const { tree, onChange } = render();
    openSheet(tree);

    ReactTestRenderer.act(() => {
      options(tree)[0].props.onPress();
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(options(tree)).toHaveLength(0);
  });

  it('turns into the picked relative, with a way straight back', () => {
    const { tree, onChange } = render({
      programId: 'gold',
      familyMemberId: 'son',
    });

    expect(textsOf(tree)).toEqual(['СП', 'Записи близкого', 'Сидоров Пётр']);

    const [, reset] = touchables(tree, 'button');
    expect(reset.props.accessibilityLabel).toBe('Вернуться к моим записям');

    ReactTestRenderer.act(() => reset.props.onPress());

    expect(onChange).toHaveBeenCalledWith({});
  });

  it('falls back to the own list once a picked relative leaves the family', () => {
    mockFamily.isLoading = true;
    const loading = render({ programId: 'gold', familyMemberId: 'gone' });

    expect(loading.onChange).not.toHaveBeenCalled();

    mockFamily.isLoading = false;
    const loaded = render({ programId: 'gold', familyMemberId: 'gone' });

    expect(loaded.onChange).toHaveBeenCalledWith({});
  });
});
