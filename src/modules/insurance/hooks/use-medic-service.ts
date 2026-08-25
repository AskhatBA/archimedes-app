import { useQuery } from '@tanstack/react-query';

import { insuranceApi } from '@/api';

export const useMedicService = (
  clinicId?: string | null,
  medicIIN?: string | null,
) => {
  const { data, isLoading } = useQuery({
    queryKey: ['insurance', 'medic-service', clinicId, medicIIN],
    queryFn: async () => {
      console.log('[medic-service] request', { clinicId, medicIIN });

      try {
        const response = await insuranceApi.medicServiceList({
          clinicId: clinicId!,
          medicIIN: medicIIN!,
        });

        console.log(
          '[medic-service] response',
          JSON.stringify(response.data, null, 2),
        );

        return response.data?.medicService || null;
      } catch (error) {
        const axiosError = error as {
          response?: { data?: unknown };
          message?: string;
        };
        console.log(
          '[medic-service] error',
          JSON.stringify(
            axiosError.response?.data || axiosError.message,
            null,
            2,
          ),
        );
        throw error;
      }
    },
    enabled: !!clinicId && !!medicIIN,
    staleTime: 1000 * 60 * 5,
  });

  return { medicService: data || null, isLoading };
};
