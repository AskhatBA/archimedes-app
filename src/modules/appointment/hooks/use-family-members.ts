import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import { usePrograms } from '@/modules/insurance';
import { useUser } from '@/modules/user';
import { familyQueryOptions } from '@/shared/lib/insurance';

import { collectFamilyMembers } from '../lib/family-members';

/**
 * The patient's relatives across every live programme, each listed once — see
 * `collectFamilyMembers`. `isLoading` stays true until every family has answered, so a
 * caller deciding whether there is anyone to show does not decide on half the answer.
 */
export const useFamilyMembers = () => {
  const { user } = useUser();
  const { programs, loadingPrograms } = usePrograms();

  // An expired programme covers nobody — the same rule as the booking form.
  const livePrograms = useMemo(
    () => programs.filter(program => program.status !== 'EXPIRED'),
    [programs],
  );

  return useQueries({
    queries: livePrograms.map(program => familyQueryOptions(program.id)),
    combine: results => ({
      members: collectFamilyMembers(
        livePrograms,
        results.map(result => result.data),
        user.misPatientId,
      ),
      programTitles: livePrograms.map(program => program.title),
      isLoading: loadingPrograms || results.some(result => result.isLoading),
    }),
  });
};
