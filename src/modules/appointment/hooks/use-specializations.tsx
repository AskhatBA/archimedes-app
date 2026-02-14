import { useQuery } from '@tanstack/react-query';

import { misApi } from '@/api';

export const useSpecializations = (
  branchId?: string,
  isTelemedicine?: boolean,
) => {
  const { data: specializations, isLoading: loadingSpecializations } = useQuery(
    {
      queryKey: ['specializations', branchId],
      queryFn: async () =>
        (await misApi.specializationsList({ branchId })).data
          ?.specializations || [],
      enabled: !!branchId,
    },
  );

  // Оставить только терапевтов если выбрана телемедицина
  const filteredSpecializations = isTelemedicine
    ? (specializations || []).filter(spec => spec.name.includes('Терапевт'))
    : specializations || [];

  return {
    specializations: filteredSpecializations,
    loadingSpecializations,
  };
};
