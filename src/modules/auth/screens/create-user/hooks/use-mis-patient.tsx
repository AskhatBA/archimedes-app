import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { misApi } from '@/api';

export const useMisPatient = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['mis-patient'],
    queryFn: async () => (await misApi.findPatientList()).data,
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
