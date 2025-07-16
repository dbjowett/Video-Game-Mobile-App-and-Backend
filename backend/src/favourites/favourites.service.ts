import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GamesService } from 'src/games/games.service';
import { FaveGame, ListGame } from 'src/games/types';

@Injectable()
export class FavouriteService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly gamesService: GamesService,
  ) {}

  async addToFavourites(userId: string, gameId: string): Promise<unknown> {
    const existingFavourite =
      await this.databaseService.favouriteGame.findFirst({
        where: {
          userId,
          gameId,
        },
      });

    if (existingFavourite) {
      throw new ConflictException('Game already favourited');
    }

    return this.databaseService.favouriteGame.create({
      data: {
        userId,
        gameId,
      },
    });
  }

  async removeFromFavourites(userId: string, gameId: string): Promise<unknown> {
    return this.databaseService.favouriteGame.deleteMany({
      where: {
        userId,
        gameId,
      },
    });
  }

  async getFavourites(userId: string): Promise<FaveGame[]> {
    return this.databaseService.favouriteGame.findMany({
      where: {
        userId,
      },
    });
  }

  async getFavouriteDetails(userId: string): Promise<ListGame[]> {
    const favourites = await this.getFavourites(userId);

    if (favourites.length === 0) {
      throw new Error('No games found');
    }

    const gameIds = favourites.map((game) => Number(game.gameId));
    return this.gamesService.getListGames(gameIds);
  }
}
