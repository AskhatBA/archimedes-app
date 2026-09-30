import { useQuery } from '@tanstack/react-query';

import { insuranceApi } from '@/api';

/** One programme's family, shared by every screen that reads it so they hit one cache. */
export const familyQueryOptions = (programId?: string) => ({
  queryKey: ['family', programId],
  queryFn: async () =>
    (await insuranceApi.familyList({ programId })).data?.family,
});

export const useFamily = (programId?: string) => {
  const { data: family, isLoading: loadingFamily } = useQuery({
    ...familyQueryOptions(programId),
    enabled: !!programId,
  });

  return {
    family,
    loadingFamily,
  };
};
