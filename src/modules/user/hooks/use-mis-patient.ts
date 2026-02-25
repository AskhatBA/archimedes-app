import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { misApi } from '@/api';
import { useAuth } from '@/shared/lib/auth';

export const useMisPatient = () => {
  const { loginIin } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['mis-patient', loginIin],
    queryFn: async () => (await misApi.findPatientList({ iin: loginIin })).data,
    retry: false,
  });

  return {
    misPatient: data,
    loadingMisPatient: isLoading,
  };
};
