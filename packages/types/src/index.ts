// ---- Auth / User ----

// Wire-format of what GET/PATCH /profile actually returns
// (backend omits password, updatedAt, googleId before responding).
export interface User {
  id: string;
  email: string;
  username: string;
  profileImage: string | null;
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

// ---- Game lists ----

export interface GameList {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  isSystem: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  position: number;
}

export interface GameListItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  listId: string;
  gameId: number;
  gameTitle: string;
  position: number;
  gameCoverUrl: string;
}

export interface GameListWithCovers extends GameList {
  items: Array<{ gameId: string; gameCoverUrl: string }>;
}

// ---- IGDB-shaped game data ----

export interface GameCover {
  id: number;
  url: string;
}

export interface ListGame {
  id: number;
  cover: GameCover;
  name: string;
  first_release_date?: number;
  total_rating: number;
  platforms?: Array<{ id: number; name: string }>;
  screenshots?: Array<{ id: number; url: string }>;
  popularity?: number;
}

export interface SimilarGame {
  id: number;
  name: string;
  cover: { id: number; url: string };
}

export interface DetailedGame {
  id: string;
  name: string;
  summary: string;
  total_rating: number;
  cover: { id: string; url: string };
  screenshots: Array<{ id: number; url: string }>;
  videos: Array<{ id: number; name: string; video_id: string }>;
  game_modes: Array<{ id: number; slug: string; name: string }>;
  similar_games: Array<SimilarGame>;
  storefronts?: Array<{ name: string; url: string }>;
}

export type AddableGame = Pick<ListGame, 'id' | 'name'> | Pick<DetailedGame, 'id' | 'name'>;

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

export interface FaveGame {
  createdAt: string;
  gameId: string;
  updatedAt: string;
  userId: string;
}
