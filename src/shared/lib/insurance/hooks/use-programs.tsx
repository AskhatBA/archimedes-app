import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect } from 'react';

import { insuranceApi } from '@/api';
import {
  GET_INSURANCE_PROGRAM_QUERY,
  GET_INSURANCE_PROGRAMS_QUERY,
} from '@/shared/constants';

export const usePrograms = () => {
  const {
    data: programs,
    isLoading: loadingPrograms,
    isFetching: fetchingPrograms,
    refetch: refetchPrograms,
    error,
  } = useQuery({
    queryKey: [GET_INSURANCE_PROGRAMS_QUERY],
    queryFn: async () => (await insuranceApi.programsList()).data?.programs,
    retry: false,
  });

  useEffect(() => {
    console.log('error', error);
  }, [error]);

  useEffect(() => {
    console.log('programs: ', programs);
  }, [programs]);

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
    queryKey: [GET_INSURANCE_PROGRAM_QUERY, programId],
    queryFn: async () =>
      (await insuranceApi.programsDetail(programId)).data?.program,
    enabled: !!programId,
  });

  return {
    program,
    loadingProgram,
  };
};
