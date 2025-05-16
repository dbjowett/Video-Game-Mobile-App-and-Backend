import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { api } from '../utils/api';

const addToFavourites = async (gameId: string) =>
  await api.post('favourites', { json: { gameId } }).json();

export const useAddFavouriteGame = (gameId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToFavourites,
    mutationKey: ['addFavouriteGame', gameId],
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favouriteGames'] }),
    onError: (error) => {
      Alert.alert(
        'Error',
        'An error occurred while adding the game to your favourites. Please try again later.',
        [{ text: 'OK' }]
      );
      console.error('Error adding game to favourites:', error);
    },
  });
};
