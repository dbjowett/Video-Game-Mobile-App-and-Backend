import { useQuery } from '@tanstack/react-query';

const fetchGames = async (query: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/games/?q=${query}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch games');
  }

  const data = await response.json();

  return data.map((game: any) => ({
    image: game.cover?.url ? `https:${game.cover.url}` : '',
    value: game.name,
    id: game.id,
    rating: game?.total_rating,
    description: `Game ID: ${game.id}`,
  }));
};

export const useGameSearch = (query: string) => {
  return useQuery({
    queryKey: ['games', query],
    queryFn: () => fetchGames(query),
    enabled: !!query,
  });
};
