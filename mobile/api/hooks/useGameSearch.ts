import { useQuery } from '@tanstack/react-query';
import { ListGame } from '@vg/types';

import { api } from '../utils/api';

const fetchGames = async (query: string) => {
  try {
    return await api.get(`games/search/?q=${query}`).json<ListGame[]>();
  } catch {
    // oxlint-disable-next-line unicorn/no-useless-undefined -- keeps consistent-return happy
    return undefined;
  }
};

export const useGameSearch = (query: string) => {
  return useQuery({
    queryKey: ['games', query],
    queryFn: () => fetchGames(query),
    enabled: !!query,
  });
};
