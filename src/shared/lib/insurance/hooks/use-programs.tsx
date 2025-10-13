import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { insuranceApi } from '@/api';

export const usePrograms = () => {
  const {
    data: programs,
    isLoading: loadingPrograms,
    isFetching: fetchingPrograms,
    refetch: refetchPrograms,
    error,
  } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => (await insuranceApi.programsList()).data?.programs,
    retry: false,
  });

  return {
    programs: programs || [],
    loadingPrograms,
    fetchingPrograms,
    refetchPrograms,
    isNotAuthorized:
      (error as AxiosError<{ message: string }>)?.response?.data?.message ===
      'INSURANCE_USER_NOT_AUTHORIZED',
  };
};

export const useProgramById = (programId: string) => {
  const { data: program, isLoading: loadingProgram } = useQuery({
    queryKey: ['program', programId],
    queryFn: async () =>
      (await insuranceApi.programsDetail(programId)).data?.program,
    enabled: !!programId,
  });

  return {
    program,
    loadingProgram,
  };
};
