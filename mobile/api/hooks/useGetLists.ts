import { useQuery } from '@tanstack/react-query';
import { GameListWithCovers } from '../types/game-list';
import { api } from '../utils/api';

const getUsersLists = async (): Promise<GameListWithCovers[]> => {
  const res = await api('gamelist/');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

export function useGetLists() {
  return useQuery({
    queryKey: ['game-lists'],
    queryFn: getUsersLists,
  });
}
