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

// ** Game Card
export interface ListGame {
  id: number;
  cover: Cover;
  name: string;
  first_release_date?: number; // Unix timestamp
  total_rating: number;
  platforms?: Array<{
    id: number;
    name: string;
  }>;
  screenshots?: Array<{
    id: number;
    url: string;
  }>;
}

// ** Detailed Game
export interface DetailedGame {
  id: string;
  name: string;
  summary: string;
  total_rating: number;

  cover: {
    id: string;
    url: string;
  };

  screenshots: Array<{
    id: number;
    url: string;
  }>;

  videos: Array<{
    id: number;
    name: string;
    video_id: string; // YouTube video ID
  }>;

  game_modes: Array<{
    id: number;
    slug: string;
    name: string;
  }>;

  similar_games: Array<SimilarGame>;
}

export interface SimilarGame {
  id: number;
  name: string;
  cover: {
    id: number;
    url: string;
  };
}

export type AddableGame =
  | Pick<ListGame, 'id' | 'name'>
  | Pick<DetailedGame, 'id' | 'name'>;

export interface FaveGame {
  createdAt: string;
  gameId: string;
  updatedAt: string;
  userId: string;
}
