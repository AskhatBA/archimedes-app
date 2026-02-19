import { create } from 'zustand';

interface PageHeaderState {
  title: string;
}

interface PageHeaderActions {
  setTitle: (title: string) => void;
}

type PageHeaderStore = PageHeaderState & PageHeaderActions;

export const usePageHeaderStore = create<PageHeaderStore>(set => ({
  title: '',
  setTitle: (title: string) => set({ title }),
}));
