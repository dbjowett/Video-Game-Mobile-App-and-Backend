import { useQuery } from '@tanstack/react-query';
import { fetchGameSearch } from '@vg/queries/fetchGameSearch';

import { api } from '../utils/api';

const fetchGames = async (query: string) => {
  try {
    return await fetchGameSearch(api, query);
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
