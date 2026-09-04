import { useQuery } from '@tanstack/react-query';

import { insuranceApi } from '@/api';
import { useRefetchOnScreenFocus } from '@/shared/hooks';

/**
 * Balance of the medical account ("медсчёт") the clinic keeps for the patient.
 *
 * Re-read on screen focus rather than on an interval: it only moves when the account is
 * topped up or spent on a service, and the patient is coming back to the screen either
 * way. `errorCode` is the insurance API's own failure signal — a non-zero one means the
 * number it sent is not a balance, so it is shown as unavailable rather than as zero.
 */
export const useMedAccount = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['insurance', 'med-account'],
    queryFn: async () =>
      (await insuranceApi.medAccountList()).data?.medAccount ?? null,
    staleTime: 1000 * 60,
  });

  useRefetchOnScreenFocus(refetch);

  return {
    balance: data && data.errorCode === 0 ? data.totalBalance : null,
    isLoading,
  };
};
