import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';

interface DetailedGame {
  id: string;
  name: string;
  cover: {
    id: string;
    url: string;
  };
  total_rating: number;
}

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
