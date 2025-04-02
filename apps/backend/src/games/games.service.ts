import { Injectable } from '@nestjs/common';
import { GameDetails, PopularGame } from '@shared/types';
import { IgdbService } from 'src/igdb/igdb.service';
import { ExploreQueryDto } from './games.dto';

@Injectable()
export class GameService {
  private cache: Map<string, any> = new Map();

  constructor(private readonly igdbService: IgdbService) {}

  async getPopularGames(): Promise<PopularGame[]> {
    const query = `fields game_id, value, popularity_type; sort value desc; limit 9; where popularity_type = 2;`;
    return this.igdbService.request<PopularGame[]>(
      'popularity_primitives',
      query,
    );
  }

  async getGameDetailsById(gameIds: number[]): Promise<GameDetails[]> {
    const query = `fields name, cover.*; where id = (${gameIds.join(',')});`;
    return this.igdbService.request<GameDetails[]>('games', query);
  }

  async getPopGamesWithDetails() {
    const cacheKey = 'popular_games';
    const cachedData = this.cache.get(cacheKey);

    if (cachedData) return cachedData;

    const popularGames = await this.getPopularGames();
    const gameIds = popularGames.map((g) => g.game_id);
    const gameDetails = await this.getGameDetailsById(gameIds);

    this.cache.set(cacheKey, gameDetails);
    setTimeout(() => this.cache.delete(cacheKey), 3600 * 1000);

    return gameDetails;
  }

  async getGames(query: string) {
    const igdbQuery = `fields name, cover.url, total_rating; search "${query}";`;
    return this.igdbService.request<GameDetails[]>('games', igdbQuery);
  }
  async getGamesQuery(queryParams: ExploreQueryDto) {
    let igdbQuery = `fields game_id, cover.url value, popularity_type; sort value desc; limit 10; where popularity_type = 2;`;
    if (queryParams.query) {
      igdbQuery = igdbQuery + `search "${queryParams.query}"`;
    }
    return this.igdbService.request<GameDetails[]>('games', igdbQuery);
  }
}
