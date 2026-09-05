import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GameList } from '@vg/types';

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
      await api.post(`gamelist/update-order`, { json: formData });
    },
    onMutate: async (formData: UpdateListOrderObject) => {
      const { id, from, to } = formData;
      await qc.cancelQueries({ queryKey: ['game-lists'] });
      const prevLists = qc.getQueryData<GameList[]>(['game-lists']) ?? [];
      const updatedLists = prevLists.map((list) => {
        if (list.id === id) {
          return { ...list, position: to };
        }
        if (to > from && list.position >= from && list.position <= to) {
          return { ...list, position: list.position - 1 };
        }
        if (to < from && list.position <= from && list.position >= to) {
          return { ...list, position: list.position + 1 };
        }
        return list;
      });

      updatedLists.sort((a, b) => a.position - b.position);
      qc.setQueryData(['game-lists'], updatedLists);

      return { prevLists };
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['game-lists'] });
    },
    onError: (_error, formData, context) => {
      if (context) qc.setQueryData(['game-lists'], context.prevLists);
    },
  });
}
