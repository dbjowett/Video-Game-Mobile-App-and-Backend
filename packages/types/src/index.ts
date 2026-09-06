// ---- IGDB enums ----

export const IgdbPlatform = {
  PC: 6,
  PS5: 167,
  XboxSeriesX: 169,
  Switch2: 508,
  PS4: 48,
  XboxOne: 49,
  Switch: 130,
  Xbox360: 12,
  PS3: 9,
  WiiU: 41,
  Mac: 14,
  Linux: 3,
} as const;

export type IgdbPlatform = (typeof IgdbPlatform)[keyof typeof IgdbPlatform];

// IGDB's own `platform_logo` images are cropped marketing banners (mismatched backgrounds,
// baked-in SKU text), not icon-shaped assets — `iconKey` instead picks a brand glyph rendered
// locally (see frontend PlatformPicker).
export type PlatformIconKey =
  | 'windows'
  | 'playstation5'
  | 'playstation4'
  | 'playstation3'
  | 'xbox'
  | 'nintendo'
  | 'apple'
  | 'linux';

export interface PlatformOption {
  id: IgdbPlatform;
  name: string;
  tier: 'top' | 'more';
  iconKey: PlatformIconKey;
}

export const PLATFORM_OPTIONS: PlatformOption[] = [
  { id: IgdbPlatform.PC, name: 'PC', tier: 'top', iconKey: 'windows' },
  { id: IgdbPlatform.PS5, name: 'PlayStation 5', tier: 'top', iconKey: 'playstation5' },
  { id: IgdbPlatform.XboxSeriesX, name: 'Xbox Series X|S', tier: 'top', iconKey: 'xbox' },
  { id: IgdbPlatform.Switch2, name: 'Nintendo Switch 2', tier: 'top', iconKey: 'nintendo' },
  { id: IgdbPlatform.PS4, name: 'PlayStation 4', tier: 'top', iconKey: 'playstation4' },
  { id: IgdbPlatform.XboxOne, name: 'Xbox One', tier: 'top', iconKey: 'xbox' },
  { id: IgdbPlatform.Switch, name: 'Nintendo Switch', tier: 'more', iconKey: 'nintendo' },
  { id: IgdbPlatform.Xbox360, name: 'Xbox 360', tier: 'more', iconKey: 'xbox' },
  { id: IgdbPlatform.PS3, name: 'PlayStation 3', tier: 'more', iconKey: 'playstation3' },
  { id: IgdbPlatform.WiiU, name: 'Wii U', tier: 'more', iconKey: 'nintendo' },
  { id: IgdbPlatform.Mac, name: 'Mac', tier: 'more', iconKey: 'apple' },
  { id: IgdbPlatform.Linux, name: 'Linux', tier: 'more', iconKey: 'linux' },
];

export const DEFAULT_PLATFORM_IDS = PLATFORM_OPTIONS.filter((p) => p.tier === 'top').map(
  (p) => p.id,
);

export const IgdbGameType = {
  MainGame: 0,
  DlcAddon: 1,
  Expansion: 2,
  Bundle: 4,
  StandaloneExpansion: 8,
  Remake: 9,
} as const;

export type IgdbGameType = (typeof IgdbGameType)[keyof typeof IgdbGameType];

export const ALLOWED_GAME_TYPE_IDS: IgdbGameType[] = [
  IgdbGameType.MainGame,
  IgdbGameType.DlcAddon,
  IgdbGameType.Expansion,
  IgdbGameType.Bundle,
  IgdbGameType.StandaloneExpansion,
  IgdbGameType.Remake,
];

export const IgdbPopularityType = {
  Visits: 1,
  WantToPlay: 2,
  Playing: 3,
  Played: 4,
  PeakPlayers24h: 5,
  PositiveReviews: 6,
  NegativeReviews: 7,
  TotalReviews: 8,
} as const;

export type IgdbPopularityType = (typeof IgdbPopularityType)[keyof typeof IgdbPopularityType];

// ---- Auth / User ----

// Wire-format of what GET/PATCH /profile actually returns
// (backend omits password, updatedAt, googleId before responding).
export interface User {
  id: string;
  email: string;
  username: string;
  profileImage: string | null;
  createdAt: string;
  preferredPlatformIds: number[];
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

// Completion times in hours, sourced from HowLongToBeat. Absent when no
// confident match was found for the game.
export interface CompletionTimes {
  mainStory?: number;
  mainExtra?: number;
  completionist?: number;
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
  completionTimes?: CompletionTimes;
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
