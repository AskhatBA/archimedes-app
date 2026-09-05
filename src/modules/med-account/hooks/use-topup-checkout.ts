import { useMutation } from '@tanstack/react-query';

import { paymentApi } from '@/api';

import { TopupOption } from '../types';

interface TopupCheckoutOptions {
  onReady: (result: { paymentUrl: string; paymentId: string }) => void;
  onError: (message?: string) => void;
}

/**
 * Starts payment for one top-up amount.
 *
 * Only the option id travels as metadata — the amount charged is checked against the
 * catalogue server-side, so an amount that went stale on the device is refused here, while
 * the payer still has an unspent card, rather than after the money has moved. The top-up
 * itself is recorded by the backend when the payment settles, so it lands even if the app
 * is closed on the provider's page.
 */
export const useTopupCheckout = ({
  onReady,
  onError,
}: TopupCheckoutOptions) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      option,
      description,
    }: {
      option: TopupOption;
      description: string;
    }) => {
      const { data } = await paymentApi.initCreate({
        amount: option.amount,
        description,
        purpose: 'MED_ACCOUNT_TOPUP',
        metadata: { optionId: option.id },
      });

      if (!data?.paymentUrl) {
        throw new Error('Missing payment url');
      }

      return { paymentUrl: data.paymentUrl, paymentId: data.paymentId };
    },
    onSuccess: onReady,
    onError: (error: unknown) => {
      // The backend says why it refused — a retired amount, or one repriced since the
      // screen was cached.
      const reason = (
        error as { response?: { data?: { message?: string } } } | undefined
      )?.response?.data?.message;

      onError(reason);
    },
  });

  return { startTopup: mutate, isStartingTopup: isPending };
};
