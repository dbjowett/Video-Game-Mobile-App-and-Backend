import { useQuery } from '@tanstack/react-query';
import { ListGame } from '@vg/types';
import { api } from '../utils/api';

const fetchHeroImages = async (): Promise<ListGame[]> => {
  const res = await api('games/popular');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

export function useFetchHero() {
  return useQuery({
    queryKey: ['hero'],
    queryFn: fetchHeroImages,
  });
}
