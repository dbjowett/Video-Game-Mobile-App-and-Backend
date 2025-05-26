import { useQuery } from '@tanstack/react-query';
import { DetailedGame } from '../types/game';
import { api } from '../utils/api';

const getGameDetails = async (id: string) => {
  const res = await api.get(`games/${id}`).json<DetailedGame>();
  if (!res) {
    throw new Error('Game not found');
  }
  return res;
};

export const useGameDetails = (id: string) => {
  return useQuery({
    queryKey: ['gameDetails', id],
    queryFn: () => getGameDetails(id),
    enabled: !!id,
  });
};
