import { DetailedGame } from '@vg/types';
import type { KyInstance } from 'ky';

export const fetchGameDetails = (api: KyInstance, id: string) =>
  api.get(`games/${id}`).json<DetailedGame>();
