import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { api } from '../utils/api';

const removeFromFavourites = async (gameId: string) =>
  await api.delete('favourites', { json: { gameId } }).json();

export const useRemoveFavouriteGame = (gameId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromFavourites,
    mutationKey: ['removeFavouriteGame', gameId],
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favouriteGames'] }),
    onError: (error) => {
      Alert.alert(
        'Error',
        'An error occurred while delete the game from your favourites. Please try again later.',
        [{ text: 'OK' }]
      );
      console.error('Error adding game to favourites:', error);
    },
  });
};
