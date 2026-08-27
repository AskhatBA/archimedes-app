import { useCallback, useState } from 'react';

import { paymentApi } from '@/api';

import { usePurchasesStore } from '../store/use-purchases-store';

/**
 * Purchase history kept on the device, with statuses re-checked against the backend
 * payment records.
 */
export const usePurchases = () => {
  const purchases = usePurchasesStore(state => state.purchases);
  const createPurchase = usePurchasesStore(state => state.createPurchase);
  const setStatus = usePurchasesStore(state => state.setStatus);
  const removePurchase = usePurchasesStore(state => state.removePurchase);

  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Re-reads every purchase still waiting on a result. The backend re-checks the
   * provider for payments that have been pending for over a minute, so this also
   * settles the ones whose callback never arrived.
   */
  const refreshPending = useCallback(async () => {
    const pending = usePurchasesStore
      .getState()
      .purchases.filter(
        purchase => purchase.status === 'PENDING' && !!purchase.paymentId,
      );

    if (pending.length === 0) return;

    setIsRefreshing(true);

    try {
      await Promise.all(
        pending.map(async purchase => {
          try {
            const { data } = await paymentApi.statusDetail(purchase.paymentId!);

            if (data?.status) setStatus(purchase.id, data.status);
          } catch {
            // A failed check leaves the purchase pending — it is retried on next refresh.
          }
        }),
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [setStatus]);

  return {
    purchases,
    isEmpty: purchases.length === 0,
    isRefreshing,
    createPurchase,
    removePurchase,
    refreshPending,
  };
};
