import {
  collectFamilyMembers,
  initialsOf,
  shortNameOf,
} from '../family-members';

const relative = (
  benId: string | undefined,
  fullName: string,
  dateBirth = '2014-03-12T00:00:00',
  relationship = 'Ребенок',
  isSelf = false,
) => ({ id: `row-${benId}`, benId, fullName, dateBirth, relationship, isSelf });

describe('collectFamilyMembers', () => {
  it('lists each person once, under the first programme that has them', () => {
    const members = collectFamilyMembers(
      [{ id: 'gold' }, { id: 'med' }],
      [
        [
          relative('owner', 'Сидоров Иван Петрович', '1985-01-01', 'Основной'),
          relative('son', 'Сидоров Пётр Иванович'),
        ],
        [
          relative('son', 'Сидоров Пётр Иванович'),
          relative('owner', 'Сидоров Иван Петрович', '1985-01-01', 'Основной'),
          relative('wife', 'Сидорова Мария', '1988-10-01', 'Супруг(а)'),
        ],
      ],
      'owner',
    );

    expect(members).toEqual([
      {
        benId: 'son',
        fullName: 'Сидоров Пётр Иванович',
        relationship: 'Ребенок',
        birthDate: '2014-03-12',
        programId: 'gold',
      },
      {
        benId: 'wife',
        fullName: 'Сидорова Мария',
        relationship: 'Супруг(а)',
        birthDate: '1988-10-01',
        programId: 'med',
      },
    ]);
  });

  it('leaves out the row the backend marks as the patient, whatever its id', () => {
    const members = collectFamilyMembers(
      [{ id: 'gold' }],
      [
        [
          // The insurer's id for the patient is not their MIS id.
          relative(
            'insurer-id',
            'Сидоров Иван Петрович',
            '1985-01-01',
            'Основной',
            true,
          ),
          relative('son', 'Сидоров Пётр Иванович'),
        ],
      ],
      'mis-id',
    );

    expect(members.map(member => member.benId)).toEqual(['son']);
  });

  it('skips rows the backend could not check and families not loaded yet', () => {
    const members = collectFamilyMembers(
      [{ id: 'gold' }, { id: 'med' }],
      [[relative(undefined, 'Без Идентификатора')], undefined],
      'owner',
    );

    expect(members).toEqual([]);
  });

  it('leaves the birth date out when the insurer gave an unusable one', () => {
    const [member] = collectFamilyMembers(
      [{ id: 'gold' }],
      [[relative('son', 'Сидоров Пётр', 'не дата')]],
      'owner',
    );

    expect(member.birthDate).toBeNull();
  });
});

describe('names', () => {
  it('takes initials and a short name from the first two words', () => {
    expect(initialsOf('сидоров  пётр иванович')).toBe('СП');
    expect(shortNameOf(' Сидоров Пётр Иванович ')).toBe('Сидоров Пётр');
    expect(initialsOf('Мадина')).toBe('М');
  });
});
