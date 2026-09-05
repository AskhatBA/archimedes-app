import { useQuery } from '@tanstack/react-query';

import { medAccountApi } from '@/api';
import { GET_MED_ACCOUNT_OPTIONS_QUERY } from '@/shared/constants';

import { TopupOption } from '../types';

/**
 * The amounts a patient can top the medical account up by.
 *
 * The list is ours, edited from the dashboard, so it changes rarely — but it is cached
 * only for a few minutes rather than for the session: an amount the admin retires must
 * stop being offered before the backend refuses the payment for it.
 */
export const useTopupOptions = () => {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [GET_MED_ACCOUNT_OPTIONS_QUERY],
    queryFn: async (): Promise<TopupOption[]> => {
      const { data: response } = await medAccountApi.optionsList();

      return (response?.options || []).map(option => ({
        id: option.id as string,
        amount: option.amount as number,
        label: option.label ?? null,
        popular: option.popular ?? false,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    options: data || [],
    loadingOptions: isLoading,
    fetchingOptions: isFetching,
    refetchOptions: refetch,
  };
};
