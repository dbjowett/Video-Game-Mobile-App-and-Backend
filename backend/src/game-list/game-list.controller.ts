import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GameList, GameListItem } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { UserPayload } from 'src/auth/types';
import { User } from 'src/common/utils/user.decorator';
import {
  AddGameToListDto,
  CreateGameListDto,
  RemoveGameFromListDto,
} from './dto';
import { GameListService, GameListWithCovers } from './game-list.service';

@UseGuards(JwtAuthGuard)
@Controller('gamelist')
export class GameListController {
  constructor(private readonly gameListService: GameListService) {}

  @Get()
  async getGameLists(@User() user: UserPayload): Promise<GameListWithCovers[]> {
    return await this.gameListService.getGameLists(user);
  }

  @Get('games/:id')
  async getGameListsGames(
    @User() user: UserPayload,
    @Param('id') id: string,
  ): Promise<GameListItem[]> {
    return await this.gameListService.getGameListGames(user, id);
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
