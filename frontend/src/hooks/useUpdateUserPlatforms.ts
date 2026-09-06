import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@vg/types';

import { api } from '../utils/api';

export const useUpdateUserPlatforms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferredPlatformIds: number[]) =>
      api.patch('profile', { json: { user: { preferredPlatformIds } } }).json<User>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};
