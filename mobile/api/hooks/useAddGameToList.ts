import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { api } from '../utils/api';

interface AddGameToListObject {
  gameListId: string;
  gameId: number;
}

export function useAddGameToList() {
  const qc = useQueryClient();

  return useMutation<AddGameToListObject, Error, AddGameToListObject>({
    mutationFn: async (formData: AddGameToListObject) =>
      await api
        .post('gamelist/add-to-list', { json: formData })
        .json<AddGameToListObject>(),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Game was added to list',
      });
      qc.invalidateQueries({ queryKey: ['game-lists'] });
    },
    onError: (e) => {
      console.error('Error:', e);
      Alert.alert('Something went wrong', e.message);
    },
  });
}
