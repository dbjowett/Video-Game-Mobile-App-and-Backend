import { useQuery } from '@tanstack/react-query';
import { fetchGameDetails } from '@vg/queries/fetchGameDetails';

import { api } from '../utils/api';

export const useGameDetails = (id: string) => {
  return useQuery({
    queryKey: ['games', id],
    queryFn: () => fetchGameDetails(api, id),
    enabled: !!id,
  });
};
