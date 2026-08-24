import { useQuery } from '@tanstack/react-query';

import { misApi } from '@/api';

const EXCLUDED_SPECIALIZATIONS = ['УЗИ', 'ВЫЕЗДНАЯ СЛУЖБА', 'МАССАЖ'];

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

  // Записаться на эти услуги через приложение нельзя
  const availableSpecializations = (specializations || []).filter(
    spec =>
      !EXCLUDED_SPECIALIZATIONS.some(excluded =>
        spec.name.toUpperCase().includes(excluded),
      ),
  );

  // Оставить только терапевтов если выбрана телемедицина
  const filteredSpecializations = isTelemedicine
    ? availableSpecializations.filter(spec => spec.name.includes('Терапевт'))
    : availableSpecializations;

  return {
    specializations: filteredSpecializations,
    loadingSpecializations,
  };
};
