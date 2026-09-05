import { useQuery } from '@tanstack/react-query';
import { fetchPopularGames } from '@vg/queries/fetchPopularGames';

import { api } from '../utils/api';

export const usePopularGames = () => {
  return useQuery({
    queryKey: ['games', 'popular-games'],
    queryFn: () => fetchPopularGames(api),
  });
};
