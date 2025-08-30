import { useQuery } from '@tanstack/react-query';

import { misApi } from '@/api';

export const useBranches = () => {
  const { data: branches, isLoading: loadingBranches } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => (await misApi.branchesList()).data?.branches || [],
  });

  return {
    branches,
    loadingBranches,
  };
};
