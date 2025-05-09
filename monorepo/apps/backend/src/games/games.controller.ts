import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from 'src/utils';
import { SearchGamesDto } from './games.dto';
import { GameService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GameService) {}

  @Public()
  @Get('popular')
  async getPopularGames(): Promise<unknown> {
    return await this.gameService.getPopGamesWithDetails();
  }
  @Get('search')
  async searchGames(@Query() queryParams: SearchGamesDto): Promise<unknown> {
    return await this.gameService.searchGames(queryParams);
  }

  @Get(':id')
  async getGameById(@Param('id') id: string): Promise<unknown> {
    const gameId = parseInt(id, 10);
    if (isNaN(gameId)) {
      throw new Error('Invalid game ID');
    }
    const data = await this.gameService.getGameDetails(gameId);

    if (!data || data.length === 0) {
      throw new Error('Game not found');
    }
    const game = data[0];
    if (!game) {
      throw new Error('Game not found');
    }

    return game;
  }
}
