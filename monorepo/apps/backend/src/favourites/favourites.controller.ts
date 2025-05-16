import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { UserPayload } from 'src/auth/types';
import { User } from 'src/utils/user.decorator';
import { FavouriteService } from './favourites.service';

@UseGuards(JwtAuthGuard)
@Controller('favourites')
export class FavouritesController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Post()
  async addToFavourites(
    @User() user: UserPayload,
    @Body('gameId') gameId: string,
  ): Promise<unknown> {
    const userId = user.id;
    if (!userId) throw new Error('User ID not found');
    if (!gameId) throw new Error('Game ID not found');

    return await this.favouriteService.addToFavourites(userId, gameId);
  }

  @Delete()
  async removeFromFavourites(
    @User() user: UserPayload,
    @Body('gameId') gameId: string,
  ): Promise<unknown> {
    const userId = user.id;
    if (!userId) throw new Error('User ID not found');

    return await this.favouriteService.removeFromFavourites(userId, gameId);
  }

  @Get()
  async getFavourites(@User() user: UserPayload): Promise<unknown> {
    const userId = user.id;
    if (!userId) throw new Error('User ID not found');

    return await this.favouriteService.getFavourites(userId);
  }
}
