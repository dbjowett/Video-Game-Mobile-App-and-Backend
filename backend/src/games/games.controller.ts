import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/utils';
import { GameService } from './games.service';
export interface PopularGame {
  id: number;
  game_id: number;
  popularity_type: number;
  value: number;
}

export interface Cover {
  id: number;
  url: string;
  width: number;
  height: number;
}

export interface GameDetails {
  id: number;
  cover: Cover;
  name: string;
}

@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GameService) {}

  @Public()
  @Get('popular')
  async getPopularGames(): Promise<unknown> {
    // TODO: Move this to a service
    const popularGames = await this.gameService.getPopularGames();
    const gameIds = popularGames.map((g) => g.game_id);
    const gameDetails = await this.gameService.getGameDetails(gameIds);
    return gameDetails;
  }
}
