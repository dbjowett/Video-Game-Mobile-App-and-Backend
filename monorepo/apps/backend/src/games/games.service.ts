import { Injectable } from '@nestjs/common';
import { GameDetails, PopularGame } from '@shared/types';
import { IgdbService } from 'src/igdb/igdb.service';
import { SearchGamesDto } from './games.dto';

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

  async getSimpleGames(gameIds: number[]): Promise<GameDetails[]> {
    const query = `fields name, cover.*; where id = (${gameIds.join(',')});`;
    return this.igdbService.request<GameDetails[]>('games', query);
  }

  async getPopGamesWithDetails() {
    const cacheKey = 'popular_games';
    const cachedData = this.cache.get(cacheKey);

    if (cachedData) return cachedData;

    const popularGames = await this.getPopularGames();
    const gameIds = popularGames.map((g) => g.game_id);
    const gameDetails = await this.getSimpleGames(gameIds);

    this.cache.set(cacheKey, gameDetails);
    setTimeout(() => this.cache.delete(cacheKey), 3600 * 1000);

    return gameDetails;
  }

  async getGames(query: string) {
    const igdbQuery = `fields name, cover.url, total_rating; search "${query}";`;
    return this.igdbService.request<GameDetails[]>('games', igdbQuery);
  }

  async getGameDetails(id: number) {
    const igdbQuery = `fields name, summary, cover.url, total_rating; where id = ${id};`;
    return this.igdbService.request<GameDetails[]>('games', igdbQuery);
  }

  async searchGames(queryParams: SearchGamesDto) {
    const igdbQuery = `fields name, cover.url, total_rating; search "${queryParams.q}";`;
    return this.igdbService.request<GameDetails[]>('games', igdbQuery);
  }
}
