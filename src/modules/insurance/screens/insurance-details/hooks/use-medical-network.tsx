import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { insuranceApi } from '@/api';
import { AvailableInsuranceCity } from '@/api/generated/data-contracts';

interface UseMedicalNetworkParams {
  cityId: string;
  programId: string;
}

export const useMedicalNetwork = (params?: UseMedicalNetworkParams) => {
  const { cityId, programId } = params || {};

  const { data: cities, isLoading: loadingCities } = useQuery({
    queryKey: ['insurance', 'cities'],
    queryFn: async () => (await insuranceApi.citiesList()).data?.cities || [],
    staleTime: 1000 * 60 * 10,
  });

  const { data: clinics, isLoading: loadingClinics } = useQuery({
    queryKey: ['insurance', 'medical-network', programId, cityId],
    queryFn: async () =>
      (
        await insuranceApi.medicalNetworkList({
          cityId: `${cityId}`,
          programId,
        })
      ).data?.clinics || [],
    staleTime: 1000 * 60 * 5,
    enabled: !!cities?.length && !!cityId && !!programId,
  });

  const cityOptions = useMemo(
    () =>
      (cities || []).map(city => ({
        label: city.title,
        value: String(city.id),
        raw: city,
      })),
    [cities],
  );

  return {
    cities: (cities || []) as AvailableInsuranceCity[],
    cityOptions,
    clinics,
    loading: loadingCities || loadingClinics,
  };
};
