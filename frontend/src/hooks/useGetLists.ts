import { useQuery } from '@tanstack/react-query';
import { fetchGameLists } from '@vg/queries/fetchGameLists';

import { api } from '../utils/api';

export const useGetLists = () => {
  return useQuery({
    queryKey: ['game-lists'],
    queryFn: () => fetchGameLists(api),
  });
};
