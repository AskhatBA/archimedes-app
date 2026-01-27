import { useQuery } from '@tanstack/react-query';

import { misApi } from '@/api';

export const useMedicalTests = () => {
  const { data: medicalTests, isLoading: loadingMedicalTests } = useQuery({
    queryKey: ['medical-tests'],
    queryFn: async () => {
      const response = await misApi.laboratoryResultsList();
      return response.data?.laboratoryResults || [];
    },
  });

  return {
    medicalTests,
    loadingMedicalTests,
  };
};
