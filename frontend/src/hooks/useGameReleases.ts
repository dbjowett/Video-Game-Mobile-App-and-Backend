import { useQuery } from '@tanstack/react-query';
import { fetchGameReleases } from '@vg/queries/fetchGameReleases';

import { api } from '../utils/api';

type DateParams = { month: string } | { start: string; end: string };

export const useGameReleases = (params: DateParams & { platformIds?: number[] }) => {
  const key =
    'month' in params
      ? ['games', 'releases', params.month, params.platformIds]
      : ['games', 'releases', params.start, params.end, params.platformIds];

  return useQuery({
    queryKey: key,
    queryFn: () => fetchGameReleases(api, params),
  });
};
