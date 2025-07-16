import { useQuery } from '@tanstack/react-query';
import { ListGame } from '../types/game';
import { api } from '../utils/api';

const getFavouriteDetails = async () =>
  await api.get('favourites/details').json<ListGame[]>();

export const useGetFavGameDetails = () => {
  return useQuery({
    queryKey: ['favouriteGameDetails'],
    queryFn: getFavouriteDetails,
  });
};
