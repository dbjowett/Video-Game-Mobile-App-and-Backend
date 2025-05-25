import { Cover } from '@shared/types';

type PopKey =
  | 'visits'
  | 'wantToPlay'
  | 'playing'
  | 'played'
  | 'peakPlayers24h'
  | 'positiveReviews'
  | 'negativeReviews'
  | 'totalReviews';

export interface PopularityMultiQuery {
  name: PopKey;
  result: {
    id: number;
    game_id: number;
    popularity_type: number;
  }[];
}

export type PopGameResults = {
  visits: ListGame[];
  wantToPlay: ListGame[];
  playing: ListGame[];
  played: ListGame[];
  peakPlayers24h: ListGame[];
  positiveReviews: ListGame[];
  negativeReviews: ListGame[];
  totalReviews: ListGame[];
};

export interface ListGame {
  id: number;
  cover: Cover;
  name: string;
  total_rating: number;
}
