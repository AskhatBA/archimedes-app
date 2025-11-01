import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { insuranceApi } from '@/api';
import { AvailableInsuranceCity } from '@/api/generated/data-contracts';

interface UseMedicalNetworkParams {
  cityId: string;
  programId: string;
  type?: number;
}

export const useMedicalNetwork = (params?: UseMedicalNetworkParams) => {
  const { cityId, programId, type } = params || {};

  const { data: cities, isLoading: loadingCities } = useQuery({
    queryKey: ['insurance', 'cities'],
    queryFn: async () => (await insuranceApi.citiesList()).data?.cities || [],
    staleTime: 1000 * 60 * 10,
  });

  const { data: clinics, isLoading: loadingClinics } = useQuery({
    queryKey: ['insurance', 'medical-network', programId, cityId, type],
    queryFn: async () =>
      (
        await insuranceApi.medicalNetworkList({
          cityId: `${cityId}`,
          programId,
          type: type ? type.toString() : undefined,
        })
      ).data?.clinics || [],
    staleTime: 1000 * 60 * 5,
    enabled: !!cities?.length && !!cityId && !!programId,
  });

  const cityOptions = useMemo(() => {
    const options = (cities || []).map(city => ({
      label: city.title || '',
      value: String(city.id),
      raw: city,
    }));

    const priority = ['Астана', 'Алматы'];
    const collator =
      typeof Intl !== 'undefined' && typeof Intl.Collator === 'function'
        ? new Intl.Collator('ru', { sensitivity: 'base' })
        : null;

    options.sort((a, b) => {
      const ai = priority.indexOf(a.label);
      const bi = priority.indexOf(b.label);
      if (ai !== -1 || bi !== -1) {
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      }
      if (collator) {
        return collator.compare(a.label, b.label);
      }
      return (a.label || '').localeCompare(b.label || '', 'ru');
    });

    return options;
  }, [cities]);

  return {
    cities: (cities || []) as AvailableInsuranceCity[],
    cityOptions,
    clinics,
    loading: loadingCities || loadingClinics,
  };
};
