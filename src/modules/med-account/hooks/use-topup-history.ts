import { useQuery } from '@tanstack/react-query';

import { medAccountApi } from '@/api';
import { GET_MED_ACCOUNT_TOPUPS_QUERY } from '@/shared/constants';
import { useRefetchOnScreenFocus } from '@/shared/hooks';

import { Topup, TopupStatus } from '../types';

/**
 * The patient's own top-ups, newest first.
 *
 * Re-read on screen focus rather than on an interval. A top-up changes twice after the app
 * has stopped watching — when the payment settles, and again when the clinic posts it onto
 * the medical account — and both can happen while the patient is elsewhere, so the moment
 * they come back to this list is exactly when it needs to be true.
 */
export const useTopupHistory = () => {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [GET_MED_ACCOUNT_TOPUPS_QUERY],
    queryFn: async (): Promise<Topup[]> => {
      const { data: response } = await medAccountApi.topupsList();

      return (response?.topups || []).map(topup => ({
        id: topup.id as string,
        amount: topup.amount ?? 0,
        status: (topup.status ?? 'PENDING') as TopupStatus,
        creditedAt: topup.creditedAt ?? null,
        createdAt: topup.createdAt as string,
      }));
    },
  });

  useRefetchOnScreenFocus(refetch);

  return {
    topups: data || [],
    loadingTopups: isLoading,
    fetchingTopups: isFetching,
    refetchTopups: refetch,
  };
};
