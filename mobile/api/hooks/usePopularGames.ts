import { useQuery } from '@tanstack/react-query';
import { PopGameResults } from '@vg/types';
import { api } from '../utils/api';

export const popularGamesKey = ['games', 'popular'] as const;

export function usePopularGames() {
  return useQuery({
    queryKey: [...popularGamesKey],
    queryFn: async () => {
      return api.get(`games/popular-games`).json<PopGameResults>();
    },
  });
}
