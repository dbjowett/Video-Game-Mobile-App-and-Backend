import { useQuery } from '@tanstack/react-query';
import { fetchGameReleases } from '@vg/queries/fetchGameReleases';

import { api } from '../utils/api';

export const useGameReleases = (params: { month: string } | { start: string; end: string }) => {
  const key =
    'month' in params
      ? ['games', 'releases', params.month]
      : ['games', 'releases', params.start, params.end];

  return useQuery({
    queryKey: key,
    queryFn: () => fetchGameReleases(api, params),
  });
};
