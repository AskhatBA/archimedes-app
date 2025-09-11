import { useQuery } from '@tanstack/react-query';

import { insuranceApi } from '@/api';

export const useFamily = (programId?: string) => {
  const { data: family, isLoading: loadingFamily } = useQuery({
    queryKey: ['family', programId],
    queryFn: async () =>
      (await insuranceApi.familyList({ programId })).data?.family,
    enabled: !!programId,
  });

  return {
    family,
    loadingFamily,
  };
};
