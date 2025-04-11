import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '../types/auth';
import { api } from '../utils/api';

// ** Add any field allowed to update inside the Pick<>
type PartialUser = Partial<Pick<User, 'profileImage' | 'username'>>;

export function useUpdateUser() {
  const qc = useQueryClient();

  return useMutation<User, Error, PartialUser>({
    mutationFn: async (user: PartialUser) =>
      await api.patch('profile', { json: { user } }).json<User>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
