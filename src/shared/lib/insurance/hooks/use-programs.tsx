import { useQuery } from '@tanstack/react-query';

import { insuranceApi } from '@/api';

export const usePrograms = () => {
  const { data: programs, isLoading: loadingPrograms } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => (await insuranceApi.programsList()).data?.programs,
  });

  return {
    programs,
    loadingPrograms,
  };
};
