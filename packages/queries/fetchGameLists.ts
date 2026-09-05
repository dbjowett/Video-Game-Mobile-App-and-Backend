import { GameListWithCovers } from '@vg/types';
import type { KyInstance } from 'ky';

export const fetchGameLists = (api: KyInstance) => api.get('gamelist').json<GameListWithCovers[]>();
