import { PopGameResults } from '@vg/types';
import type { KyInstance } from 'ky';

export const fetchPopularGames = (api: KyInstance, platformIds?: number[]) =>
  api
    .get('games/popular-games', {
      searchParams: platformIds?.length ? { platforms: platformIds.join(',') } : undefined,
    })
    .json<PopGameResults>();
