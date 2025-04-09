import { useQuery } from '@tanstack/react-query';
import { User } from '../types/auth';
import { api } from '../utils/api';

export const profileKey = ['profile'] as const;

export function useUser() {
  return useQuery({
    queryKey: profileKey,
    queryFn: async () => {
      return api.get(`profile`).json<User>();
    },
  });
}
