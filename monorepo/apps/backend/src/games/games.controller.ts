import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from 'src/utils';
import { SearchGamesDto } from './games.dto';
import { GamesService } from './games.service';

// @UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  // To populate the login page on web
  @Public()
  @Get('popular')
  async getPopularGames(): Promise<unknown> {
    return await this.gamesService.getPopGamesWithDetails();
  }

  // To populate the landing page on web and mobile
  @Public()
  @Get('popular-games')
  async getPopGames(): Promise<unknown> {
    return await this.gamesService.getPopularGames();
  }

  @Get('search')
  async searchGames(@Query() queryParams: SearchGamesDto): Promise<unknown> {
    return await this.gamesService.searchGames(queryParams);
  }

  @Get(':id')
  async getGameById(@Param('id') id: string): Promise<unknown> {
    return await this.gamesService.getGameDetails(id);
  }
}
