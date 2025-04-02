import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { Game } from '../types/game';

export const exploreGamesKey = ['games', 'explore'] as const;

export function useExploreGames() {
  return useQuery({
    queryKey: [...exploreGamesKey],
    queryFn: async () => {
      return api.get(`popular`) as Promise<Game[]>;
    },
  });
}
