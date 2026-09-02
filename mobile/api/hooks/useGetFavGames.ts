import { useQuery } from '@tanstack/react-query';
import { FaveGame } from '@vg/types';
import { api } from '../utils/api';

const getFavourites = async () => await api.get('favourites').json<FaveGame[]>();

export const useGetFavouriteGames = () => {
  return useQuery({
    queryKey: ['favouriteGames'],
    queryFn: getFavourites,
  });
};
