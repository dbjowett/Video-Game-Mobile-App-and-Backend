import { Controller, Get } from '@nestjs/common';
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

  @Get('popular')
  async getPopularGames(): Promise<unknown> {
    const popularGames = await this.gameService.getPopularGames();
    const gameIds = popularGames.map((g) => g.game_id);
    console.log('gameIds', gameIds);
    console.log('gameIds.length', gameIds.length);
    const gameDetails = await this.gameService.getGameDetails(gameIds);

    console.log('gameDetails', gameDetails);
    console.log('gameDetails.length', gameDetails.length);
    return gameDetails;
  }
}
