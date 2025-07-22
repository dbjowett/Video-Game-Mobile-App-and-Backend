import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GameList, GameListItem, Prisma } from '@prisma/client';
import { UserPayload } from 'src/auth/types';
import { DatabaseService } from 'src/database/database.service';
import { GamesService } from 'src/games/games.service';
import { BatchPayload } from 'src/types';
import {
  AddGameToListDto,
  CreateGameListDto,
  RemoveGameFromListDto,
} from './dto';

export type GameListWithCovers = Prisma.GameListGetPayload<{
  include: {
    items: {
      take: 4;
      orderBy: { position: 'asc' };
      select: {
        gameId: true;
        gameCoverUrl: true;
      };
    };
  };
}>;

@Injectable()
export class GameListService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly gamesService: GamesService,
  ) {}

  async getGameCover(gameId: number): Promise<string> {
    const game = await this.gamesService.getGameCover(gameId.toString());
    return game.cover.url;
  }

  async getGameLists(user: UserPayload): Promise<GameListWithCovers[]> {
    let gameLists: GameListWithCovers[] = [];
    try {
      gameLists = await this.databaseService.gameList.findMany({
        where: {
          userId: user.id,
        },
        include: {
          items: {
            orderBy: { position: 'asc' },
            take: 4,
            select: { gameId: true, gameCoverUrl: true },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Cannot find any lists for this user');
    }

    return gameLists;
  }

  async getGameListGames(
    user: UserPayload,
    id: string,
  ): Promise<GameListItem[]> {
    let games: GameListItem[] = [];
    try {
      games = await this.databaseService.gameListItem.findMany({
        where: {
          listId: id,
        },
      });
    } catch (error) {
      throw new NotFoundException('No games found with ID: ', id);
    }
    return games;
  }

  async createNewGameList(user: UserPayload, body: CreateGameListDto) {
    const { gameIds, title, description, isPublic } = body;

    if (!user.id) throw new Error('User ID not found');
    let gameListItems: BatchPayload;
    let gameList: GameList;

    const entries = await Promise.all(
      gameIds.map(async (gameId: number) => {
        const gameCoverUrl = await this.getGameCover(gameId);
        return [gameId, gameCoverUrl] as const;
      }),
    );

    const imgMap = new Map<number, string>(entries);

    try {
      gameList = await this.databaseService.gameList.create({
        data: {
          userId: user.id,
          title,
          description,
          isPublic: Boolean(isPublic),
        },
      });

      const gameListItemsToCreate = await Promise.all(
        gameIds.map(async (gameId) => {
          return {
            gameId,
            listId: gameList.id,
            position: 0,
            gameCoverUrl: imgMap.get(gameId),
          };
        }),
      );

      gameListItems = await this.databaseService.gameListItem.createMany({
        data: gameListItemsToCreate,
        skipDuplicates: true,
      });
    } catch (error) {
      throw new Error('Failed to create game list: ' + error.message);
    }
    if (gameListItems.count === 0) {
      throw new Error(
        'No game IDs provided or all game IDs already exist in the list',
      );
    }

    return {
      ...gameList,
      gameIds,
    };
  }

  async addGameToGameList(user: UserPayload, body: AddGameToListDto) {
    const doesExist = await this.databaseService.gameListItem.findUnique({
      where: {
        listId_gameId: {
          listId: body.gameListId,
          gameId: body.gameId,
        },
      },
    });

    if (doesExist)
      throw new ConflictException('This game already exists in the list');

    const maxPosition = await this.databaseService.gameListItem.aggregate({
      _max: {
        position: true,
      },
      where: {
        listId: body.gameListId,
      },
    });
    const nextPosition = (maxPosition._max.position ?? -1) + 1;
    let gameListItem: GameListItem;
    const gameImg = await this.getGameCover(body.gameId);

    try {
      gameListItem = await this.databaseService.gameListItem.create({
        data: {
          gameId: body.gameId,
          listId: body.gameListId,
          position: nextPosition,
          gameCoverUrl: gameImg,
        },
      });
    } catch (error) {
      throw new Error('Failed to add game to list: ' + error.message);
    }

    return gameListItem;
  }

  async removeGameFromList(user: UserPayload, body: RemoveGameFromListDto) {
    const gameListItem = await this.databaseService.gameListItem.findUnique({
      where: {
        listId_gameId: {
          listId: body.gameListId,
          gameId: body.gameId,
        },
      },
    });

    if (!gameListItem) {
      throw new NotFoundException('Game not found in list');
    }

    try {
      await this.databaseService.gameListItem.delete({
        where: {
          listId_gameId: {
            listId: body.gameListId,
            gameId: body.gameId,
          },
        },
      });

      await this.databaseService.gameListItem.updateMany({
        where: {
          listId: body.gameListId,
          position: {
            gt: gameListItem.position,
          },
        },
        data: {
          position: {
            decrement: 1,
          },
        },
      });

      return gameListItem;
    } catch (error) {
      throw new Error('Failed to remove game from list: ' + error.message);
    }
  }

  // async addToFavourites(userId: string, gameId: string): Promise<unknown> {
  //   if (existingFavourite) {
  //     throw new ConflictException('Game already favourited');
  //   }
  // }

  // async removeFromFavourites(userId: string, gameId: string): Promise<unknown> {
  //   return this.databaseService.userGameList.deleteMany({
  //     where: {
  //       userId,
  //       gameId,
  //     },
  //   });
  // }

  // async getFavourites(userId: string): Promise<FaveGame[]> {
  //   return this.databaseService.userGameList.findMany({
  //     where: {
  //       userId,
  //     },
  //   });
  // }

  // async getFavouriteDetails(userId: string): Promise<ListGame[]> {
  //   const favourites = await this.getFavourites(userId);

  //   if (favourites.length === 0) {
  //     throw new Error('No games found');
  //   }

  //   const gameIds = favourites.map((game) => Number(game.gameId));
  //   return this.gamesService.getListGames(gameIds);
  // }
}
