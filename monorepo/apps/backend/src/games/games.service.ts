import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IgdbService } from 'src/igdb/igdb.service';
import { SearchGamesDto } from './games.dto';
import { POPULARITY_MULTI_QUERY } from './queries';
import {
  DetailedGame,
  ListGame,
  PopGameResults,
  PopularityMultiQuery,
} from './types';

// ** Must match `ListGame` interface in `mobile/api/types/game.ts` and frontend type
const LIST_GAME_FIELDS_QUERY = `
  fields
    name,
    cover.url,
    total_rating,
    screenshots.url,
    first_release_date,
    platforms.name
  `;

@Injectable()
export class GamesService {
  private cache: Map<string, any> = new Map();
  private readonly logger: Logger = new Logger(GamesService.name);

  constructor(private readonly igdbService: IgdbService) {}

  async getListGames(gameIds: number[]): Promise<ListGame[]> {
    const query = `${LIST_GAME_FIELDS_QUERY}; where id = (${gameIds.join(',')});`;
    return this.igdbService.request<ListGame[]>('games', query);
  }

  async getPopularGamesMultiQuery() {
    return this.igdbService.request<PopularityMultiQuery[]>(
      'multiquery',
      POPULARITY_MULTI_QUERY,
    );
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

      results.forEach((result) => {
        if (result.name in popGames) {
          popGames[result.name] = result.gameInfo;
        }
      });

      return popGames;
    } catch (error) {
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

  async getGameDetails(id: string) {
    if (isNaN(Number(id))) throw new Error('Invalid game ID');

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
      total_rating;

      where id = ${id};
    `;

    const data = await this.igdbService.request<DetailedGame[]>(
      'games',
      igdbQuery,
    );
    if (data.length < 1) throw new Error('No game found for this id');
    return data[0];
  }

  async searchGames(queryParams: SearchGamesDto) {
    const igdbQuery = `${LIST_GAME_FIELDS_QUERY}; search "${queryParams.q}";`;
    return this.igdbService.request<ListGame[]>('games', igdbQuery);
  }

  async getReleasesByMonth(month: string) {
    if (!month) {
      throw new BadRequestException(
        'Month query param is required in YYYY-MM format.',
      );
    }

    const [year, monthNum] = month.split('-').map(Number);
    if (!year || !monthNum || monthNum < 1 || monthNum > 12) {
      throw new Error('Invalid month format. Use YYYY-MM.');
    }

    const start = new Date(Date.UTC(year, monthNum - 1, 1));
    const end = new Date(Date.UTC(year, monthNum, 1));

    const startUnix = Math.floor(start.getTime() / 1000);
    const endUnix = Math.floor(end.getTime() / 1000);

    const platformIds = [6, 167, 169, 130, 48, 49]; // PC, PS5, Xbox Series X, Switch, PS4, Xbox One
    const allowedTypes = [0, 1, 2, 4, 8, 9]; // Game, DLC, Expansion, Bundle, Standalone Expansion, Remake

    const igdbQuery = `
    ${LIST_GAME_FIELDS_QUERY};
     where 
      first_release_date >= ${startUnix} &
      first_release_date < ${endUnix} &
      platforms = (${platformIds.join(',')}) &
      game_type = (${allowedTypes.join(',')}) &
      (hypes > 1 | total_rating_count > 1);
      sort first_release_date asc;
      limit 500;
    `;

    return this.igdbService.request<ListGame[]>('games', igdbQuery);
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
