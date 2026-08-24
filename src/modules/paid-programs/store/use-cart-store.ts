import { create } from 'zustand';

import { PaidProgram } from '../types';

interface CartState {
  /** A program is either in the cart or not — quantities are not part of the flow. */
  items: PaidProgram[];
}

interface CartActions {
  addItem: (program: PaidProgram) => void;
  removeItem: (programId: string) => void;
  clearCart: () => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>(set => ({
  items: [],
  addItem: program =>
    set(state =>
      state.items.some(item => item.id === program.id)
        ? state
        : { items: [...state.items, program] },
    ),
  removeItem: programId =>
    set(state => ({
      items: state.items.filter(item => item.id !== programId),
    })),
  clearCart: () => set({ items: [] }),
}));
