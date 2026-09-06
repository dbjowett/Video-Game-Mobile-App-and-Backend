import { BadRequestException, Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ListGame, PopGameResults } from '@vg/types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { Public } from 'src/common/utils';

import { SearchGamesDto } from './games.dto';
import { GamesService } from './games.service';

@UseGuards(JwtAuthGuard)
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
  async getPopGames(@Query('platforms') platforms?: string): Promise<PopGameResults> {
    return await this.gamesService.getPopularGames(this.parsePlatforms(platforms));
  }

  @Get('search')
  async searchGames(@Query() queryParams: SearchGamesDto): Promise<ListGame[]> {
    return await this.gamesService.searchGames(queryParams);
  }

  @Public()
  @Get('releases')
  async getReleases(
    @Query('month') month?: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('platforms') platforms?: string,
  ): Promise<ListGame[]> {
    const platformIds = this.parsePlatforms(platforms);
    if (month) return await this.gamesService.getReleasesByMonth(month, platformIds);
    if (start && end)
      return await this.gamesService.getReleasesByDateRange(start, end, platformIds);
    throw new BadRequestException('Either month or start and end query params are required.');
  }

  // To populate the landing page's Popular Upcoming section
  @Public()
  @Get('popular-upcoming')
  async getPopularUpcoming(
    @Query('days') days?: string,
    @Query('limit') limit?: string,
    @Query('platforms') platforms?: string,
  ): Promise<ListGame[]> {
    return await this.gamesService.getPopularUpcomingGames(
      days ? Number(days) : undefined,
      limit ? Number(limit) : undefined,
      this.parsePlatforms(platforms),
    );
  }

  private parsePlatforms(platforms?: string): number[] | undefined {
    if (!platforms) return undefined;
    const ids = platforms
      .split(',')
      .map(Number)
      .filter((id) => !Number.isNaN(id));
    return ids.length > 0 ? ids : undefined;
  }

  @Get(':id')
  async getGameById(@Param('id') id: string) {
    return await this.gamesService.getGameDetails(id);
  }
}
