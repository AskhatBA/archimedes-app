import { useQuery } from '@tanstack/react-query';

import { appointmentApi } from '@/api';

const EXCLUDED_SPECIALIZATIONS = ['УЗИ', 'ВЫЕЗДНАЯ СЛУЖБА', 'МАССАЖ'];

/**
 * Specialties of a branch. For a telemedicine visit the backend itself drops the ones that
 * cannot be held online (`isTelemedicine=true`), so the list is cached per visit type.
 */
export const useSpecializations = (
  branchId?: string,
  isTelemedicine?: boolean,
) => {
  const { data: specializations, isLoading: loadingSpecializations } = useQuery(
    {
      queryKey: ['specializations', branchId, !!isTelemedicine],
      queryFn: async () =>
        (
          await appointmentApi.specializationsList({
            branchId: branchId!,
            ...(isTelemedicine ? { isTelemedicine: true } : {}),
          })
        ).data?.specializations || [],
      enabled: !!branchId,
    },
  );

  // Записаться на эти услуги через приложение нельзя
  const availableSpecializations = (specializations || []).filter(
    spec =>
      !EXCLUDED_SPECIALIZATIONS.some(excluded =>
        (spec.name ?? '').toUpperCase().includes(excluded),
      ),
  );

  return {
    specializations: availableSpecializations,
    loadingSpecializations,
  };
};
