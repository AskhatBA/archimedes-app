import { useQuery } from '@tanstack/react-query';

import { insuranceApi } from '@/api';

export const usePrograms = () => {
  const { data: programs, isLoading: loadingPrograms } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => (await insuranceApi.programsList()).data?.programs,
  });

  return {
    programs,
    loadingPrograms,
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
