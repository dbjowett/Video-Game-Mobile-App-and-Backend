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

// ** Game Card
export interface ListGame {
  id: number;
  cover: Cover;
  name: string;
  total_rating: number;
}

export interface DetailedGame {
  id: string;
  name: string;
  cover: {
    id: string;
    url: string;
  };
  summary: string;
  total_rating: number;

  screenshots: {
    id: number;
    url: string;
  }[];

  videos: {
    id: number;
    video_id: string; // YouTube video ID
  }[];

  game_modes: {
    id: number;
    slug: string;
    name: string;
  }[];
}
