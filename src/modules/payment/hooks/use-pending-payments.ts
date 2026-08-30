import { useQuery } from '@tanstack/react-query';

import { paymentApi, PaymentPurpose, PendingPayment } from '@/api';
import {
  useRefetchOnScreenFocus,
  useScreenRefetchInterval,
} from '@/shared/hooks';

const REFRESH_INTERVAL_MS = 15000;

/**
 * Payments of one purpose that the user started but has not finished.
 *
 * Generic on purpose, like `usePaymentStatus`: it returns the raw payments with whatever
 * metadata the backend stored, and the feature that owns that purpose decides how to show
 * them. Kept fresh on an interval so a payment settled elsewhere (provider callback or
 * the backend's reconciliation sweep) disappears from the list on its own — including the
 * one the payer was just sent back from, which is why the screen is read again on focus
 * rather than waiting out the interval.
 */
export const usePendingPayments = (purpose?: PaymentPurpose) => {
  const refetchInterval = useScreenRefetchInterval(REFRESH_INTERVAL_MS);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['payment', 'pending', purpose],
    queryFn: async () =>
      (await paymentApi.pendingList(purpose ? { purpose } : undefined)).data
        ?.payments || [],
    refetchInterval,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  useRefetchOnScreenFocus(refetch);

  return {
    pendingPayments: (data || []) as PendingPayment[],
    isLoading,
  };
};
