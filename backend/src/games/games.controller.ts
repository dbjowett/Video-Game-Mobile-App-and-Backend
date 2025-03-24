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
    return await this.gameService.getPopGamesWithDetails();
  }
}
