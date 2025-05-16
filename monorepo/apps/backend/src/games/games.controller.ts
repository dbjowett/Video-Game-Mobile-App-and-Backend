import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { Public } from 'src/utils';
import { SearchGamesDto } from './games.dto';
import { GamesService } from './games.service';

@UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Public()
  @Get('popular')
  async getPopularGames(): Promise<unknown> {
    return await this.gamesService.getPopGamesWithDetails();
  }
  @Get('search')
  async searchGames(@Query() queryParams: SearchGamesDto): Promise<unknown> {
    return await this.gamesService.searchGames(queryParams);
  }

  @Get(':id')
  async getGameById(@Param('id') id: string): Promise<unknown> {
    // TODO: Move to service
    const gameId = parseInt(id, 10);
    if (isNaN(gameId)) {
      throw new Error('Invalid game ID');
    }
    const data = await this.gamesService.getGameDetails(gameId);

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
