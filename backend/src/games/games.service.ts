import { Injectable } from '@nestjs/common';
import { IgdbService } from 'src/igdb/igdb.service';
import { GameDetails, PopularGame } from './games.controller';

@Injectable()
export class GameService {
  constructor(private readonly igdbService: IgdbService) {}

  async getPopularGames(): Promise<PopularGame[]> {
    const query = `fields game_id, value, popularity_type; sort value desc; limit 9; where popularity_type = 2;`;
    return this.igdbService.request<PopularGame[]>(
      'popularity_primitives',
      query,
    );
  }

  async getGameDetails(gameIds: number[]): Promise<GameDetails[]> {
    const query = `fields name, cover.*; where id = (${gameIds.join(',')});`;
    return this.igdbService.request<GameDetails[]>('games', query);
  }
}
