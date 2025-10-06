import { useQuery } from '@tanstack/react-query';

import { misApi } from '@/api';

export const useDoctors = (branchId?: string, specializationId?: string) => {
  const { data: doctors, isLoading: loadingDoctors } = useQuery({
    queryKey: ['doctors', branchId, specializationId],
    queryFn: async () =>
      (await misApi.doctorsList({ branchId, specializationId })).data.doctors ||
      [],
    enabled: !!branchId && !!specializationId,
  });

  return {
    doctors: doctors || [],
    loadingDoctors,
  };
};
