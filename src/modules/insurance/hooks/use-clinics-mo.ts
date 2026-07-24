import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { insuranceApi } from '@/api';

export const useClinicsMo = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['insurance', 'clinics-mo'],
    queryFn: async () =>
      (await insuranceApi.clinicsMoList()).data?.clinicsMO || [],
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    console.log('77082224595', data);
  }, [data]);

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
