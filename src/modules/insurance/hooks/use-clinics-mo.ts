import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { insuranceApi } from '@/api';

export const useClinicsMo = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['insurance', 'clinics-mo'],
    queryFn: async () =>
      (await insuranceApi.clinicsMoList()).data?.clinicsMO || [],
    staleTime: 1000 * 60 * 10,
  });

  const clinicOptions = useMemo(
    () =>
      (data || []).map(clinic => ({
        label: clinic.name || '',
        value: clinic.oid || '',
      })),
    [data],
  );

  return { clinics: data || [], clinicOptions, isLoading };
};
