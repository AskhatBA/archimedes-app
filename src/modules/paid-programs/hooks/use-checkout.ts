import { useMutation } from '@tanstack/react-query';

import { paymentApi } from '@/api';

import { usePurchasesStore } from '../store/use-purchases-store';
import { PaidProgram } from '../types';

interface CheckoutInput {
  items: PaidProgram[];
  total: number;
  description: string;
}

interface CheckoutOptions {
  onReady: (result: { paymentUrl: string; purchaseId: string }) => void;
  onError: (message?: string) => void;
}

/**
 * Starts checkout for a paid-programs cart.
 *
 * The order is *not* created here: the cart travels to the backend as the payment's
 * metadata, and the order is written to the database server-side the moment the payment
 * settles as SUCCESS — from the provider callback or from the background reconciliation
 * sweep, so it lands even if the app is closed on the payment page.
 *
 * The local purchase record is what the history screen shows in the meantime; it carries
 * the payment id so it can follow the same payment the backend acted on.
 */
export const useCheckout = ({ onReady, onError }: CheckoutOptions) => {
  const createPurchase = usePurchasesStore(state => state.createPurchase);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ items, total, description }: CheckoutInput) => {
      const { data } = await paymentApi.initCreate({
        amount: total,
        description,
        purpose: 'PAID_PROGRAM',
        metadata: {
          items: items.map(program => ({
            category: program.category,
            id: program.id,
            code: program.code,
            title: program.title,
            price: program.price,
          })),
        },
      });

      if (!data?.paymentUrl) {
        throw new Error('Missing payment url');
      }

      const purchase = createPurchase(items, total, data.paymentId);

      return { paymentUrl: data.paymentUrl, purchaseId: purchase.id };
    },
    onSuccess: onReady,
    onError: (error: unknown) => {
      // The backend refuses a checkout it could not turn into an order — a check-up that
      // was retired or repriced since the catalogue was cached — and says why.
      const reason = (
        error as { response?: { data?: { message?: string } } } | undefined
      )?.response?.data?.message;

      onError(reason);
    },
  });

  return { checkout: mutate, isCheckingOut: isPending };
};
