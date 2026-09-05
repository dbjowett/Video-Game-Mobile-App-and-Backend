import { useQuery } from '@tanstack/react-query';
import { fetchPopularGames } from '@vg/queries/fetchPopularGames';

import { api } from '../utils/api';

export const popularGamesKey = ['games', 'popular'] as const;

export function usePopularGames() {
  return useQuery({
    queryKey: [...popularGamesKey],
    queryFn: () => fetchPopularGames(api),
  });
}
