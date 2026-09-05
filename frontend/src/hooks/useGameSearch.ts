import { useQuery } from '@tanstack/react-query';
import { fetchGameSearch } from '@vg/queries/fetchGameSearch';

import { api } from '../utils/api';

const fetchGames = async (query: string) => {
  try {
    const data = await fetchGameSearch(api, query);
    return data.map((game) => ({
      image: game.cover?.url ? `https:${game.cover.url}` : '',
      value: game.name,
      id: game.id,
      rating: game.total_rating,
      description: `Game ID: ${game.id}`,
    }));
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
