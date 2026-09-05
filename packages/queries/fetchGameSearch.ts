import { ListGame } from '@vg/types';
import type { KyInstance } from 'ky';

export const fetchGameSearch = (api: KyInstance, query: string) =>
  api.get('games/search', { searchParams: { q: query } }).json<ListGame[]>();
