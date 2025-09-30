import { create } from 'zustand';

interface SearchStore {
  input: string;
  setInput: (input: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  input: '',
  setInput: (input) => set({ input }),
}));
