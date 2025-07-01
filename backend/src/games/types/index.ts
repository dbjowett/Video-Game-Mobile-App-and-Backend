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

  similar_games: Array<{
    id: number;
    name: string;
    cover: {
      id: number;
      url: string;
    };
  }>;
}
interface Cover {
  id: number;
  url: string;
}
