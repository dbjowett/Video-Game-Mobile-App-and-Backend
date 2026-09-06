import { useQuery } from '@tanstack/react-query';
import { fetchUpcomingGames } from '@vg/queries/fetchUpcomingGames';

import { api } from '../utils/api';

export const useUpcomingGames = (platformIds?: number[]) => {
  return useQuery({
    queryKey: ['games', 'popular-upcoming', platformIds],
    queryFn: () => fetchUpcomingGames(api, { platformIds }),
  });
};
