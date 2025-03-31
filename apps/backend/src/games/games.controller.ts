import { Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/utils';
import { GameService } from './games.service';

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
