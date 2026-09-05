import { ListGame } from '@vg/types';
import type { KyInstance } from 'ky';

export const fetchUpcomingGames = (api: KyInstance, params?: { days?: number; limit?: number }) =>
  api.get('games/popular-upcoming', { searchParams: params }).json<ListGame[]>();
