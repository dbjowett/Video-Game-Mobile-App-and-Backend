import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DetailedGame, ListGame, PopGameResults, PopKey } from '@vg/types';
import { IgdbGameType, IgdbPlatform } from 'src/igdb/igdb.enums';
import { IgdbService } from 'src/igdb/igdb.service';

import { SearchGamesDto } from './games.dto';
import { buildPopularityByIdsQuery, POPULARITY_MULTI_QUERY } from './queries';

const platformIds = [
  IgdbPlatform.PC,
  IgdbPlatform.PS5,
  IgdbPlatform.XboxSeriesX,
  IgdbPlatform.Switch,
  IgdbPlatform.PS4,
  IgdbPlatform.XboxOne,
];
const allowedTypes = [
  IgdbGameType.MainGame,
  IgdbGameType.DlcAddon,
  IgdbGameType.Expansion,
  IgdbGameType.Bundle,
  IgdbGameType.StandaloneExpansion,
  IgdbGameType.Remake,
];

const STOREFRONT_HOSTNAMES: Record<string, string> = {
  'store.steampowered.com': 'Steam',
  'gog.com': 'GOG',
  'store.playstation.com': 'PlayStation Store',
  'xbox.com': 'Xbox',
  'nintendo.com': 'Nintendo eShop',
  'apps.apple.com': 'App Store',
  'play.google.com': 'Google Play',
  'store.epicgames.com': 'Epic Games Store',
  'itch.io': 'itch.io',
};

const getStorefrontLinks = (externalGames: { url?: string }[]): { name: string; url: string }[] => {
  const seen = new Set<string>();
  const result: { name: string; url: string }[] = [];

  for (const { url } of externalGames) {
    if (!url) continue;
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    const name = STOREFRONT_HOSTNAMES[hostname];
    if (name && !seen.has(name)) {
      seen.add(name);
      result.push({ name, url });
    }
  }

  return result;
};

interface PopularityMultiQuery {
  name: PopKey;
  result: { id: number; game_id: number; popularity_type: number }[];
}

// ** Must match `ListGame` interface in `mobile/api/types/game.ts` and frontend type
const LIST_GAME_FIELDS_QUERY = `
  fields
    name,
    cover.url,
    total_rating,
    screenshots.url,
    first_release_date,
    release_dates.*,
    platforms.name
  `;

@Injectable()
export class GamesService {
  private cache: Map<string, any> = new Map();
  private readonly logger: Logger = new Logger(GamesService.name);

  constructor(private readonly igdbService: IgdbService) {}

  async getListGames(gameIds: number[]): Promise<ListGame[]> {
    const query = `${LIST_GAME_FIELDS_QUERY}; limit 12; where id = (${gameIds.join(',')});`;
    return this.igdbService.request<ListGame[]>('games', query);
  }

  async getPopularityForGames(gameIds: number[]): Promise<Map<number, number>> {
    if (gameIds.length === 0) return new Map();

    const results = await this.igdbService.request<{ game_id: number; value: number }[]>(
      'popularity_primitives',
      buildPopularityByIdsQuery(gameIds),
    );

    return new Map(results.map((r) => [r.game_id, r.value]));
  }

  async getPopularGamesMultiQuery() {
    return this.igdbService.request<PopularityMultiQuery[]>('multiquery', POPULARITY_MULTI_QUERY);
  }

  async getPopularGames(): Promise<PopGameResults> {
    try {
      const multiQueryRes = await this.getPopularGamesMultiQuery();

      const promises = multiQueryRes.map(async (res) => ({
        name: res.name,
        gameInfo: await this.getListGames(res.result.map((r) => r.game_id)),
      }));

      const results = await Promise.all(promises);

      const popGames: PopGameResults = {
        visits: [],
        wantToPlay: [],
        playing: [],
        played: [],
        peakPlayers24h: [],
        positiveReviews: [],
        negativeReviews: [],
        totalReviews: [],
      };

      for (const result of results) {
        if (result.name in popGames) {
          popGames[result.name] = result.gameInfo;
        }
      }

      return popGames;
    } catch {
      throw new InternalServerErrorException('Failed to fetch popular games');
    }
  }

  async getPopGamesWithDetails() {
    const cacheKey = 'popular_games';
    const cachedData = this.cache.get(cacheKey);
    if (cachedData) return cachedData;

    const popularGames = await this.getPopularGames();

    const gameIds = popularGames.peakPlayers24h.map((g) => g.id);

    const gameDetails = await this.getListGames(gameIds);

    this.cache.set(cacheKey, gameDetails);
    setTimeout(() => this.cache.delete(cacheKey), 3600 * 1000);
    return gameDetails;
  }

  async getGames(query: string) {
    const igdbQuery = `fields name, cover.url, total_rating; search "${query}";`;
    return this.igdbService.request<ListGame[]>('games', igdbQuery);
  }

  async getGameCover(id: string) {
    if (Number.isNaN(Number(id))) throw new Error('Invalid game ID');

    const igdbQuery = `
      fields 
      cover.url;
       
      where id = ${id};
    `;

    const data = await this.igdbService.request<DetailedGame[]>('games', igdbQuery);
    if (data.length === 0) throw new Error('No game found for this id');
    return data[0];
  }

  async getGameDetails(id: string) {
    if (Number.isNaN(Number(id))) throw new Error('Invalid game ID');

    const igdbQuery = `
      fields
      name,
      summary,
      cover.url,
      screenshots.url,
      videos.video_id,
      videos.name,
      game_modes.slug,
      game_modes.name,
      similar_games.name,
      similar_games.cover.url,
      external_games.url,
      total_rating;

      where id = ${id};
    `;

    const data = await this.igdbService.request<
      (DetailedGame & { external_games?: { url?: string }[] })[]
    >('games', igdbQuery);
    if (data.length === 0) throw new Error('No game found for this id');

    return { ...data[0], storefronts: getStorefrontLinks(data[0].external_games ?? []) };
  }

  async searchGames(queryParams: SearchGamesDto) {
    const igdbQuery = `
      ${LIST_GAME_FIELDS_QUERY}; 
      where game_type = (${allowedTypes.join(',')}); 
      search "${queryParams.q}";
    `;
    return this.igdbService.request<ListGame[]>('games', igdbQuery);
  }

  private async getReleasesInRange(startUnix: number, endUnix: number): Promise<ListGame[]> {
    const igdbQuery = `
    ${LIST_GAME_FIELDS_QUERY};
     where
      first_release_date >= ${startUnix} &
      first_release_date < ${endUnix} &
      platforms = (${platformIds.join(',')}) &
      game_type = (${allowedTypes.join(',')});
      sort first_release_date asc;
      limit 500;
    `;

    const games = await this.igdbService.request<ListGame[]>('games', igdbQuery);
    const popularityByGameId = await this.getPopularityForGames(games.map((g) => g.id));

    return games.map((game) => ({
      ...game,
      popularity: popularityByGameId.get(game.id) ?? 0,
    }));
  }

  async getReleasesByMonth(month: string) {
    if (!month) {
      throw new BadRequestException('Month query param is required in YYYY-MM format.');
    }

    const [year, monthNum] = month.split('-').map(Number);
    if (!year || !monthNum || monthNum < 1 || monthNum > 12) {
      throw new BadRequestException('Invalid month format. Use YYYY-MM.');
    }

    const start = new Date(Date.UTC(year, monthNum - 1, 1));
    const end = new Date(Date.UTC(year, monthNum, 1));

    return this.getReleasesInRange(
      Math.floor(start.getTime() / 1000),
      Math.floor(end.getTime() / 1000),
    );
  }

  async getReleasesByDateRange(start: string, end: string) {
    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormat.test(start) || !dateFormat.test(end)) {
      throw new BadRequestException(
        'start and end query params are required in YYYY-MM-DD format.',
      );
    }

    const startDate = new Date(`${start}T00:00:00Z`);
    const endDate = new Date(`${end}T00:00:00Z`);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }

    endDate.setUTCDate(endDate.getUTCDate() + 1);

    return this.getReleasesInRange(
      Math.floor(startDate.getTime() / 1000),
      Math.floor(endDate.getTime() / 1000),
    );
  }

  async getPopularUpcomingGames(days = 30, limit = 10): Promise<ListGame[]> {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + days);

    const games = await this.getReleasesInRange(
      Math.floor(start.getTime() / 1000),
      Math.floor(end.getTime() / 1000),
    );

    return [...games].sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)).slice(0, limit);
  }

  // @Cron(CronExpression.EVERY_DAY_AT_10AM)
  // async handleCron() {
  // this.logger.log('Fetching popular games every minute');
  // const cacheKey = 'popular_games';
  // const cachedData = this.cache.get(cacheKey);
  // if (cachedData) {
  //   this.cache.delete(cacheKey);
  // }
  // const popularGames = await this.getPopularGames();
  // const gameIds = popularGames.map((g) => g.game_id);
  // const gameDetails = await this.getSimpleGames(gameIds);
  // this.cache.set(cacheKey, gameDetails);
  // }
}
