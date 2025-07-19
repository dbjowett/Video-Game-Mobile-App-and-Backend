import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GamesService } from 'src/games/games.service';
import { FaveGame, ListGame } from 'src/games/types';

@Injectable()
export class GameListService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly gamesService: GamesService,
  ) {}

  async addToFavourites(userId: string, gameId: string): Promise<unknown> {
    const existingFavourite = await this.databaseService.userGameList.findFirst(
      {
        where: {
          userId,
          gameId,
        },
      },
    );

    if (existingFavourite) {
      throw new ConflictException('Game already favourited');
    }

    const lastPosition = await this.databaseService.userGameList.aggregate({
      where: {
        userId,
        listId,
      },
      _max: {
        position: true,
      },
    });

    const newPosition = (lastPosition._max.position ?? 0) + 1;

    return this.databaseService.userGameList.create({
      data: {
        listType: 'FAVOURITES',
        position: newPosition,
        userId,
        gameId,
      },
    });
  }

  async removeFromFavourites(userId: string, gameId: string): Promise<unknown> {
    return this.databaseService.userGameList.deleteMany({
      where: {
        userId,
        gameId,
      },
    });
  }

  async getFavourites(userId: string): Promise<FaveGame[]> {
    return this.databaseService.userGameList.findMany({
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
