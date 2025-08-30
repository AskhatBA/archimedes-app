import { useQuery } from '@tanstack/react-query';

import { misApi } from '@/api';

export const useSpecializations = (branchId?: string) => {
  const { data: specializations, isLoading: loadingSpecializations } = useQuery(
    {
      queryKey: ['specializations', branchId],
      queryFn: async () =>
        (await misApi.specializationsList({ branchId })).data
          ?.specializations || [],
      enabled: !!branchId,
    },
  );

  return {
    specializations: specializations || [],
    loadingSpecializations,
  };
};
