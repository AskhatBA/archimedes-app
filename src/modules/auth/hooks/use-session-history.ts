import { useQuery } from '@tanstack/react-query';

import { getSessionHistory } from '@/shared/lib/auth/session-api';

interface UseSessionHistoryInput {
  limit?: number;
  offset?: number;
}

export const useSessionHistory = (props?: UseSessionHistoryInput) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['session-history', props?.limit, props?.offset],
    queryFn: () =>
      getSessionHistory({
        limit: props?.limit ?? 50,
        offset: props?.offset ?? 0,
      }),
  });

  return {
    sessions: data ?? [],
    isLoading,
    refetch,
  };
};
