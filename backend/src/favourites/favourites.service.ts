import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavouriteService {
  constructor(private readonly databaseService: DatabaseService) {}

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

  async getFavourites(userId: string): Promise<unknown> {
    return this.databaseService.favouriteGame.findMany({
      where: {
        userId,
      },
    });
  }
}
