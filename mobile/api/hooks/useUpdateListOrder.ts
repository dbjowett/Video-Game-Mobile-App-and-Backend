import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';

export function useUpdateListOrder() {
  const qc = useQueryClient();
  console.log('useUpdateListOrder');
  return useMutation({
    mutationFn: async ({ to, from }: { to: number; from: number }) => {
      try {
        console.log('updateListOrder', to, from);

        await api.post(`gamelist/update-order`, { json: { to, from } });
      } catch (error) {
        console.log('updateListOrder error', error);
      }
    },
    onSuccess: () => {
      console.log('updateListOrder success');
      qc.invalidateQueries({ queryKey: ['game-lists'] });
    },
  });
}
