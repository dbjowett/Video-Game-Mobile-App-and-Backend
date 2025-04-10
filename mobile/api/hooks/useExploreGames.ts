import { useQuery } from '@tanstack/react-query';
import { Game } from '../types/game';
import { api } from '../utils/api';

export const exploreGamesKey = ['games', 'explore'] as const;

export function useExploreGames() {
  return useQuery({
    queryKey: [...exploreGamesKey],
    queryFn: async () => {
      return api.get(`games/popular`).json<Game[]>();
    },
  });
}
