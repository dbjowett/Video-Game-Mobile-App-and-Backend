import { ListGame } from '@vg/types';
import type { KyInstance } from 'ky';

type DateParams = { month: string } | { start: string; end: string };

export const fetchGameReleases = (
  api: KyInstance,
  params: DateParams & { platformIds?: number[] },
) => {
  const { platformIds, ...dateParams } = params;
  return api
    .get('games/releases', {
      searchParams: {
        ...dateParams,
        ...(platformIds?.length && { platforms: platformIds.join(',') }),
      },
    })
    .json<ListGame[]>();
};
