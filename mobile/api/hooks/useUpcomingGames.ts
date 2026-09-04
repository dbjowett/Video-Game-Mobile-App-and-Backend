import { useQuery } from '@tanstack/react-query';
import { ListGame } from '@vg/types';

import { api } from '../utils/api';

export function useUpcomingGames() {
  return useQuery({
    queryKey: ['popular-upcoming-games'],
    queryFn: () => api.get('games/popular-upcoming').json<ListGame[]>(),
  });
}
