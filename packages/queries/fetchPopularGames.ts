import { PopGameResults } from '@vg/types';
import type { KyInstance } from 'ky';

export const fetchPopularGames = (api: KyInstance) =>
  api.get('games/popular-games').json<PopGameResults>();
