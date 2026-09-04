import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { ListGame, PopGameResults } from '@vg/types';
import { Public } from 'src/common/utils';

import { SearchGamesDto } from './games.dto';
import { GamesService } from './games.service';

// @UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  // To populate the login page
  @Public()
  @Get('popular')
  async getPopularGames(): Promise<ListGame[]> {
    return await this.gamesService.getPopGamesWithDetails();
  }

  // To populate the landing page on web and mobile
  @Public()
  @Get('popular-games')
  async getPopGames(): Promise<PopGameResults> {
    return await this.gamesService.getPopularGames();
  }

  @Get('search')
  async searchGames(@Query() queryParams: SearchGamesDto): Promise<ListGame[]> {
    return await this.gamesService.searchGames(queryParams);
  }

  @Get('releases')
  async getReleases(
    @Query('month') month?: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ): Promise<ListGame[]> {
    if (month) return await this.gamesService.getReleasesByMonth(month);
    if (start && end) return await this.gamesService.getReleasesByDateRange(start, end);
    throw new BadRequestException('Either month or start and end query params are required.');
  }

  // To populate the landing page's Popular Upcoming section
  @Public()
  @Get('popular-upcoming')
  async getPopularUpcoming(
    @Query('days') days?: string,
    @Query('limit') limit?: string,
  ): Promise<ListGame[]> {
    return await this.gamesService.getPopularUpcomingGames(
      days ? Number(days) : undefined,
      limit ? Number(limit) : undefined,
    );
  }

  @Get(':id')
  async getGameById(@Param('id') id: string) {
    return await this.gamesService.getGameDetails(id);
  }
}
