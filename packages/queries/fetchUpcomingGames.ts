import { ListGame } from '@vg/types';
import type { KyInstance } from 'ky';

export const fetchUpcomingGames = (
  api: KyInstance,
  params?: { days?: number; limit?: number; platformIds?: number[] },
) =>
  api
    .get('games/popular-upcoming', {
      searchParams: {
        ...(params?.days !== undefined && { days: params.days }),
        ...(params?.limit !== undefined && { limit: params.limit }),
        ...(params?.platformIds?.length && { platforms: params.platformIds.join(',') }),
      },
    })
    .json<ListGame[]>();
