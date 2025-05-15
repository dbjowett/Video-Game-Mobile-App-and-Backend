import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { UserPayload } from 'src/auth/types';
import { Public } from 'src/utils';
import { User } from 'src/utils/user.decorator';
import { SearchGamesDto } from './games.dto';
import { GameService } from './games.service';

@UseGuards(JwtAuthGuard)
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
    // TODO: Move to service
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

  @Post('favourite')
  async addToFavourites(
    @User() user: UserPayload,
    @Body('gameId') gameId: string,
  ): Promise<unknown> {
    const userId = user.id;
    if (!userId) throw new Error('User ID not found');

    return await this.gameService.addToFavourites(userId, gameId);
  }

  @Post('unfavourite')
  async removeFromFavourites(
    @User() user: UserPayload,
    @Body('gameId') gameId: string,
  ): Promise<unknown> {
    const userId = user.id;
    if (!userId) throw new Error('User ID not found');

    return await this.gameService.removeFromFavourites(userId, gameId);
  }

  @Get('favourites')
  async getFavourites(@User() user: UserPayload): Promise<unknown> {
    const userId = user.id;
    if (!userId) throw new Error('User ID not found');

    return await this.gameService.getFavourites(userId);
  }
}
