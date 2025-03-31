import { Controller, Get, Query } from '@nestjs/common';
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

// @UseGuards(AuthenticatedGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GameService) {}

  @Public()
  @Get('popular')
  async getPopularGames(): Promise<unknown> {
    return await this.gameService.getPopGamesWithDetails();
  }

  @Get()
  async getGames(@Query('q') query: string): Promise<unknown> {
    return await this.gameService.getGames(query);
  }
}
