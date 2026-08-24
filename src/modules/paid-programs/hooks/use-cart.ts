import { useMemo } from 'react';

import { useCartStore } from '../store/use-cart-store';

/** Cart contents plus the derived totals the list, bar and drawer all need. */
export const useCart = () => {
  const items = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  const removeItem = useCartStore(state => state.removeItem);
  const clearCart = useCartStore(state => state.clearCart);

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.price, 0),
    [items],
  );

  const hasItem = (programId: string) =>
    items.some(item => item.id === programId);

  return {
    items,
    count: items.length,
    total,
    isEmpty: items.length === 0,
    hasItem,
    addItem,
    removeItem,
    clearCart,
  };
};
