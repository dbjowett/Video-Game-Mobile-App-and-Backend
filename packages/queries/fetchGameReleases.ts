import { ListGame } from '@vg/types';
import type { KyInstance } from 'ky';

export const fetchGameReleases = (
  api: KyInstance,
  params: { month: string } | { start: string; end: string },
) => api.get('games/releases', { searchParams: params }).json<ListGame[]>();
