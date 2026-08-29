import { useMutation, useQueryClient } from '@tanstack/react-query';

import { paymentApi, PaymentRecord } from '@/api';

/**
 * Gives up on a payment the payer started and walked away from.
 *
 * Cancelling is a request, not a guarantee — the backend checks with FreedomPay first, so
 * callers must read the returned `status` instead of assuming the payment is gone: a card
 * charged just before the tap comes back `SUCCESS`, with whatever it paid for already
 * booked. Everything watching the payment is refreshed either way.
 */
export const useCancelPayment = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (paymentId: string): Promise<PaymentRecord> =>
      (await paymentApi.cancelCreate(paymentId)).data,
    onSettled: (_data, _error, paymentId) => {
      // Invalidated even on failure: the request may well have landed, and a stale
      // "waiting for payment" card is exactly what this flow exists to get rid of.
      queryClient.invalidateQueries({ queryKey: ['payment', 'pending'] });
      queryClient.invalidateQueries({
        queryKey: ['payment', 'status', paymentId],
      });
    },
  });

  return { cancelPayment: mutateAsync, isCancelling: isPending };
};
