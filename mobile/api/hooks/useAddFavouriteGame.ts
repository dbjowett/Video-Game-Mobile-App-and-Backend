import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { FaveGame } from '../types/game';
import { api } from '../utils/api';

const addToFavourites = async (gameId: string) =>
  await api.post('favourites', { json: { gameId } }).json<FaveGame[]>();

export const useAddFavouriteGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToFavourites,
    mutationKey: ['addFavouriteGame'],
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favouriteGames'] }),
    onMutate: async (gameId) => {
      await queryClient.cancelQueries({ queryKey: ['favouriteGames'] });
      const prevFaves = queryClient.getQueryData(['favouriteGames']) as FaveGame[];
      queryClient.setQueryData(['favouriteGames'], (prev: FaveGame[]) => [...prev, { gameId }]);
      return { prevFaves };
    },
    onError: (error) => {
      Alert.alert(
        'Error',
        'An error occurred while adding the game to your favourites. Please try again later.',
        [{ text: 'OK' }]
      );
      console.error('Error adding game to favourites:', error);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['favouriteGames'] }),
  });
};
