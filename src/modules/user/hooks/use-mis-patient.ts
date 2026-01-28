import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { misApi } from '@/api';
import { useAuth } from '@/shared/lib/auth';

export const useMisPatient = () => {
  const { loginIin } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['mis-patient', loginIin],
    queryFn: async () => (await misApi.findPatientList({ iin: loginIin })).data,
    retry: false,
  });

  useEffect(() => {
    console.log('mis-patient:', data);
  }, [data]);

  useEffect(() => {
    console.log('mis-patient error:', error);
  }, [error]);

  return {
    misPatient: data,
    loadingMisPatient: isLoading,
  };
};
