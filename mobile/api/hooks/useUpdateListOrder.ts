import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GameList } from '../types/game-list';
import { api } from '../utils/api';

type UpdateListOrderObject = {
  to: number;
  from: number;
  id: string;
};

export function useUpdateListOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData: UpdateListOrderObject) => {
      try {
        await api.post(`gamelist/update-order`, { json: formData });
      } catch (error) {
        console.log('updateListOrder error', error);
      }
    },
    onMutate: async (formData: UpdateListOrderObject) => {
      const { id, from, to } = formData;
      await qc.cancelQueries({ queryKey: ['game-lists'] });
      const prevLists = qc.getQueryData(['game-lists']) as GameList[];
      const updatedLists = prevLists.map((list) => {
        if (list.id === id) {
          return { ...list, position: to };
        }
        if (to > from) {
          // ** item moved down
          if (list.position >= from && list.position <= to) {
            return { ...list, position: list.position - 1 };
          }
        } else if (to < from) {
          // ** item moved up
          if (list.position <= from && list.position >= to) {
            return { ...list, position: list.position + 1 };
          }
        }
        return list;
      });

      updatedLists.sort((a, b) => a.position - b.position);
      qc.setQueryData(['game-lists'], updatedLists);

      return { updatedLists };
    },
    onSuccess: () => {
      console.log('updateListOrder success');
      qc.invalidateQueries({ queryKey: ['game-lists'] });
    },
    onError: (error, formData, context: any) => {
      qc.setQueryData(['game-lists'], context.prevLists);
      console.log('updateListOrder error', error);
    },
  });
}
