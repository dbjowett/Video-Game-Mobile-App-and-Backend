import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { UserPayload } from 'src/auth/types';
import { User } from 'src/common/utils/user.decorator';
import { ListGame } from 'src/games/types';
import { GameListService } from './game-list.service';

@UseGuards(JwtAuthGuard)
@Controller('gamelist')
export class GameListController {
  constructor(private readonly gameListService: GameListService) {}

  @Post()
  async addToFavourites(
    @User() user: UserPayload,
    @Body('gameId') gameId: string,
  ): Promise<unknown> {
    const userId = user.id;
    if (!userId) throw new Error('User ID not found');
    if (!gameId) throw new Error('Game ID not found');

    return await this.gameListService.addToFavourites(userId, gameId);
  }

  @Delete()
  async removeFromFavourites(
    @User() user: UserPayload,
    @Body('gameId') gameId: string,
  ): Promise<unknown> {
    const userId = user.id;
    if (!userId) throw new Error('User ID not found');

    return await this.gameListService.removeFromFavourites(userId, gameId);
  }

  @Get()
  async getFavourites(@User() user: UserPayload): Promise<unknown> {
    const userId = user.id;
    if (!userId) throw new Error('User ID not found');

    return await this.gameListService.getFavourites(userId);
  }

  @Get('details')
  async getFavouriteDetails(@User() user: UserPayload): Promise<ListGame[]> {
    const userId = user.id;
    if (!userId) throw new Error('User ID not found');

    return await this.gameListService.getFavouriteDetails(userId);
  }
}
