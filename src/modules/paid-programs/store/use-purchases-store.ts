import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { PaidProgram, Purchase, PurchaseStatus } from '../types';

interface PurchasesState {
  purchases: Purchase[];
}

interface PurchasesActions {
  /** Records the checkout attempt and returns it, so the caller can pass its id on. */
  createPurchase: (
    programs: PaidProgram[],
    total: number,
    paymentId?: string,
  ) => Purchase;
  setStatus: (purchaseId: string, status: PurchaseStatus) => void;
  removePurchase: (purchaseId: string) => void;
  /** Drops the whole history — the list belongs to one signed-in user. */
  clearPurchases: () => void;
}

type PurchasesStore = PurchasesState & PurchasesActions;

/** Local-only id — the authoritative one is the backend payment id attached later. */
const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const patch = (
  purchases: Purchase[],
  purchaseId: string,
  changes: Partial<Purchase>,
) =>
  purchases.map(purchase =>
    purchase.id === purchaseId ? { ...purchase, ...changes } : purchase,
  );

export const usePurchasesStore = create<PurchasesStore>()(
  persist(
    (set, get) => ({
      purchases: [],
      createPurchase: (programs, total, paymentId) => {
        const purchase: Purchase = {
          id: createId(),
          createdAt: new Date().toISOString(),
          programs,
          total,
          status: 'PENDING',
          // Known from the start now that checkout creates the payment itself, which is
          // what lets the history poll for the result the backend acted on.
          ...(paymentId ? { paymentId } : {}),
        };

        set({ purchases: [purchase, ...get().purchases] });

        return purchase;
      },
      setStatus: (purchaseId, status) =>
        set(state => ({
          purchases: patch(state.purchases, purchaseId, { status }),
        })),
      removePurchase: purchaseId =>
        set(state => ({
          purchases: state.purchases.filter(
            purchase => purchase.id !== purchaseId,
          ),
        })),
      clearPurchases: () => set({ purchases: [] }),
    }),
    {
      // Purchases live only on the device until the backend owns this list.
      name: 'paid-programs-purchases',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
