import {
  DetailedGame,
  ListGame,
  SimilarGame,
} from '@/api/types/game';
import { GameListItem } from '@/api/types/game-list';
import { getHumanDate } from '@/utils';

export type GameCardVariant = 'default' | 'compact' | 'feature';

export interface GameCardModel {
  id: string;
  title: string;
  imageUrl?: string;
  subtitle?: string;
  meta?: string;
  badge?: string;
}

type CardOverrides = Partial<
  Pick<GameCardModel, 'subtitle' | 'meta' | 'badge'>
>;

export const mapListGameToCard = (
  game: ListGame,
  overrides?: CardOverrides,
): GameCardModel => ({
  id: game.id.toString(),
  title: game.name,
  imageUrl: game.cover?.url,
  subtitle: overrides?.subtitle ?? getHumanDate(game.first_release_date) ?? undefined,
  meta: overrides?.meta,
  badge: overrides?.badge,
});

export const mapDetailedGameToCard = (
  game: DetailedGame,
  overrides?: CardOverrides,
): GameCardModel => ({
  id: game.id.toString(),
  title: game.name,
  imageUrl: game.cover?.url,
  subtitle: overrides?.subtitle,
  meta: overrides?.meta,
  badge: overrides?.badge,
});

export const mapGameListItemToCard = (
  item: GameListItem,
  overrides?: CardOverrides,
): GameCardModel => ({
  id: item.id,
  title: item.gameTitle,
  imageUrl: item.gameCoverUrl,
  subtitle: overrides?.subtitle ?? `Game ID ${item.gameId}`,
  meta: overrides?.meta,
  badge: overrides?.badge,
});

export const mapSimilarGameToCard = (
  game: SimilarGame,
  overrides?: CardOverrides,
): GameCardModel => ({
  id: game.id.toString(),
  title: game.name,
  imageUrl: game.cover?.url,
  subtitle: overrides?.subtitle,
  meta: overrides?.meta,
  badge: overrides?.badge,
});
