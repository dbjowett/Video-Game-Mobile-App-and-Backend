import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { GameList } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { UserPayload } from 'src/auth/types';
import { User } from 'src/common/utils/user.decorator';
import {
  AddGameToListDto,
  CreateGameListDto,
  RemoveGameFromListDto,
} from './dto';
import { GameListService } from './game-list.service';

@UseGuards(JwtAuthGuard)
@Controller('gamelist')
export class GameListController {
  constructor(private readonly gameListService: GameListService) {}

  @Get()
  async getGameLists(@User() user: UserPayload): Promise<GameList[]> {
    return await this.gameListService.getGameLists(user);
  }

  @Post('new-game-list')
  async createNewGameList(
    @User() user: UserPayload,
    @Body() body: CreateGameListDto,
  ): Promise<GameList> {
    return await this.gameListService.createNewGameList(user, body);
  }

  @Post('add-to-list')
  async addGameToList(
    @User() user: UserPayload,
    @Body() body: AddGameToListDto,
  ) {
    return await this.gameListService.addGameToGameList(user, body);
  }

  @Delete('remove-from-list')
  async removeGameFromList(
    @User() user: UserPayload,
    @Body() body: RemoveGameFromListDto,
  ) {
    return await this.gameListService.removeGameFromList(user, body);
  }

  // @Post()
  // async addToFavourites(
  //   @User() user: UserPayload,
  //   @Body('gameId') gameId: string,
  // ): Promise<unknown> {
  //   const userId = user.id;
  //   if (!userId) throw new Error('User ID not found');
  //   if (!gameId) throw new Error('Game ID not found');

  //   return await this.gameListService.addToFavourites(userId, gameId);
  // }

  // @Delete()
  // async removeFromFavourites(
  //   @User() user: UserPayload,
  //   @Body('gameId') gameId: string,
  // ): Promise<unknown> {
  //   const userId = user.id;
  //   if (!userId) throw new Error('User ID not found');

  //   return await this.gameListService.removeFromFavourites(userId, gameId);
  // }

  // @Get()
  // async getFavourites(@User() user: UserPayload): Promise<unknown> {
  //   const userId = user.id;
  //   if (!userId) throw new Error('User ID not found');

  //   return await this.gameListService.getFavourites(userId);
  // }

  // @Get('details')
  // async getFavouriteDetails(@User() user: UserPayload): Promise<ListGame[]> {
  //   const userId = user.id;
  //   if (!userId) throw new Error('User ID not found');

  //   return await this.gameListService.getFavouriteDetails(userId);
  // }
}
