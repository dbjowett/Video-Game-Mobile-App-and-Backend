interface Cover {
  id: number;
  url: string;
}

interface Genre {
  id: number;
  name: string;
}

export interface Game {
  id: number;
  name: string;
  cover: Cover;
  total_rating: number;
  releaseDate: string;
  genres: Genre[];
  first_release_date: number;
}

export type PopKey =
  | 'visits'
  | 'wantToPlay'
  | 'playing'
  | 'played'
  | 'peakPlayers24h'
  | 'positiveReviews'
  | 'negativeReviews'
  | 'totalReviews';

export type PopGameResults = Record<PopKey, ListGame[]>;

export interface ListGame {
  id: number;
  cover: Cover;
  name: string;
  total_rating: number;
}
