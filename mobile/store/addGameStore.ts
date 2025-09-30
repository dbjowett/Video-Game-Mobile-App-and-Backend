import { DetailedGame, ListGame } from '@/api/types/game';
import { createStore } from 'zustand';

type Game = DetailedGame | ListGame;

interface GameStore {
  selectedGame: Game | null;
  setSelectedGame: (selectedGame: Game) => void;
}

export const useGameStore = createStore<GameStore>((set) => ({
  selectedGame: null,
  setSelectedGame: (selectedGame: Game) => set({ selectedGame }),
}));
