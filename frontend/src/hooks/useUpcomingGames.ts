import { useQuery } from '@tanstack/react-query';
import { fetchUpcomingGames } from '@vg/queries/fetchUpcomingGames';

import { api } from '../utils/api';

export const useUpcomingGames = () => {
  return useQuery({
    queryKey: ['games', 'popular-upcoming'],
    queryFn: () => fetchUpcomingGames(api),
  });
};
