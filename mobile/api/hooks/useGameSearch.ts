import { useQuery } from '@tanstack/react-query';
import { ListGame } from '../types/game';
import { api } from '../utils/api';

const fetchGames = async (query: string) => {
  try {
    return await api.get(`games/search/?q=${query}`).json<ListGame[]>();
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

export const useGameSearch = (query: string) => {
  return useQuery({
    queryKey: ['games', query],
    queryFn: () => fetchGames(query),
    enabled: !!query,
  });
};
