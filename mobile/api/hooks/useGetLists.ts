import { useQuery } from '@tanstack/react-query';
import { GameList } from '../types/game-list';
import { api } from '../utils/api';

const getUsersLists = async (): Promise<GameList[]> => {
  const res = await api('gamelist/');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

export function useGetLists() {
  return useQuery({
    // TODO: Add key to invalidate single list
    queryKey: ['game-lists'],
    queryFn: getUsersLists,
  });
}
