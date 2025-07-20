import { useQuery } from '@tanstack/react-query';
import { GameListItem } from '../types/game-list';
import { api } from '../utils/api';

const getListsGames = async (id: string) => {
  const res = await api.get(`gamelist/games/${id}`).json<GameListItem[]>();
  if (!res) {
    throw new Error('Game not found');
  }
  return res;
};

export const useGetListsGames = (id: string) => {
  return useQuery({
    queryKey: ['gamelist-games', id],
    queryFn: () => getListsGames(id),
    enabled: !!id,
  });
};
