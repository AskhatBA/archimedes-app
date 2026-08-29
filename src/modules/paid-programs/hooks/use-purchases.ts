import { useCallback, useMemo, useState } from 'react';

import { paymentApi } from '@/api';

import { usePurchasesStore } from '../store/use-purchases-store';
import { PurchaseFilter } from '../types';

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
  const [filter, setFilter] = useState<PurchaseFilter>('ALL');

  /**
   * One checkout can pay for a mixed cart, so a purchase belongs to a category as soon
   * as it contains a single program from it — filtering hides whole payments, never
   * lines inside one, because the card has to keep adding up to the amount charged.
   */
  const visiblePurchases = useMemo(
    () =>
      filter === 'ALL'
        ? purchases
        : purchases.filter(purchase =>
            purchase.programs.some(program => program.category === filter),
          ),
    [filter, purchases],
  );

  /**
   * Re-reads every purchase still waiting on a result. The backend re-checks the
   * provider for payments that have been pending for over a minute, so this also
   * settles the ones whose callback never arrived.
   *
   * Deliberately unfiltered: a payment settles whether or not its category is on
   * screen, and a filtered-out purchase would otherwise stay pending forever.
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
    /** Everything on the device, whatever the filter is set to. */
    purchases,
    /** What the active filter leaves — this is what the list renders. */
    visiblePurchases,
    filter,
    setFilter,
    isEmpty: purchases.length === 0,
    /** Nothing matches the filter, though the history itself is not empty. */
    isFilterEmpty: purchases.length > 0 && visiblePurchases.length === 0,
    isRefreshing,
    createPurchase,
    removePurchase,
    refreshPending,
  };
};
