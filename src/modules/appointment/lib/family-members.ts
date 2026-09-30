import dayjs from 'dayjs';

import { InsuranceFamily, InsuranceProgram } from '@/api';

/** A relative whose appointments the patient can open. */
export interface FamilyMember {
  benId: string;
  fullName: string;
  /** The insurer's own wording ("Ребенок", "Супруг(а)"), shown as is. */
  relationship: string;
  /**
   * `YYYY-MM-DD`, or `null` when the insurer gave no usable date. Shown as a date rather
   * than an age: the app has no `Intl.PluralRules`, so "3 года" would come out "3 лет".
   */
  birthDate: string | null;
  /** The first live programme listing them — what the backend checks the pick against. */
  programId: string;
}

/**
 * Everyone the patient can see appointments of, across all their live programmes.
 *
 * The insurer keeps the family per programme, and a household on two programmes comes back
 * twice — the same children under each. Asking the patient to pick a programme first only
 * to find the same people again is a step with no meaning to them, so each person appears
 * once and carries the programme that vouches for them.
 *
 * The patient is in their own family too and is left out — their visits are "Мои записи".
 * The backend marks that row `isSelf`; `ownBenId` is only a fallback for a backend that
 * does not, and it misses whenever the insurer's `benId` differs from `misPatientId`.
 */
export const collectFamilyMembers = (
  programs: Pick<InsuranceProgram, 'id'>[],
  families: (InsuranceFamily[] | undefined)[],
  ownBenId?: string,
): FamilyMember[] => {
  const seen = new Set<string>();

  return programs.flatMap((program, index) =>
    (families[index] ?? []).flatMap((member): FamilyMember[] => {
      const { benId } = member;
      if (!benId || member.isSelf || benId === ownBenId || seen.has(benId))
        return [];

      seen.add(benId);

      const birthDate = member.dateBirth ? dayjs(member.dateBirth) : null;

      return [
        {
          benId,
          fullName: (member.fullName ?? '').trim(),
          relationship: (member.relationship ?? '').trim(),
          birthDate: birthDate?.isValid()
            ? birthDate.format('YYYY-MM-DD')
            : null,
          programId: program.id,
        },
      ];
    }),
  );
};

const wordsOf = (fullName: string) =>
  fullName.trim().split(/\s+/).filter(Boolean);

/** "Сидоров Пётр Иванович" → "СП". */
export const initialsOf = (fullName: string) =>
  wordsOf(fullName)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');

/** "Сидоров Пётр Иванович" → "Сидоров Пётр" — enough to know who, short enough for a row. */
export const shortNameOf = (fullName: string) =>
  wordsOf(fullName).slice(0, 2).join(' ');
