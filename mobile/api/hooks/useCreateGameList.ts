import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { api } from '../utils/api';

interface CreateGameListObject {
  title: string;
  description?: string;
  isPublic: boolean;
  gameIds: number[];
}

export function useCreateGameList() {
  const qc = useQueryClient();

  return useMutation<CreateGameListObject, Error, CreateGameListObject>({
    mutationFn: async (formData: CreateGameListObject) =>
      await api
        .post('gamelist/new-game-list', { json: formData })
        .json<CreateGameListObject>(),
    onSuccess: ({ title }) => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `${title} was created successfully!`,
      });
      qc.invalidateQueries({ queryKey: ['game-lists'] });
    },
    onError: (e) => {
      console.error('Error:', e);
      Alert.alert('Something went wrong', e.message);
    },
  });
}
