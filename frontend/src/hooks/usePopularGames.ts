import { useQuery } from '@tanstack/react-query';
import { fetchPopularGames } from '@vg/queries/fetchPopularGames';

import { api } from '../utils/api';

export const usePopularGames = (platformIds?: number[]) => {
  return useQuery({
    queryKey: ['games', 'popular-games', platformIds],
    queryFn: () => fetchPopularGames(api, platformIds),
  });
};
