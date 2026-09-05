import { useCartStore } from '../store/use-cart-store';
import { usePurchasesStore } from '../store/use-purchases-store';

/**
 * Wipes everything this module keeps on the device for the signed-in user.
 *
 * The cart lives in memory and the purchase history is persisted to AsyncStorage, so
 * neither goes away by itself when the session ends — without this the next account to
 * sign in on the same phone inherits the previous user's cart and paid programs.
 */
export const resetPaidProgramsState = async (): Promise<void> => {
  useCartStore.getState().clearCart();
  usePurchasesStore.getState().clearPurchases();
  await usePurchasesStore.persist.clearStorage();
};
