import { useQuery } from '@tanstack/react-query';
import { fetchUpcomingGames } from '@vg/queries/fetchUpcomingGames';

import { api } from '../utils/api';

export function useUpcomingGames() {
  return useQuery({
    queryKey: ['popular-upcoming-games'],
    queryFn: () => fetchUpcomingGames(api),
  });
}
