import { Module } from '@nestjs/common';
import { GamesModule } from 'src/games/games.module';
import { FavouritesController } from './favourites.controller';
import { FavouriteService } from './favourites.service';

@Module({
  imports: [GamesModule],
  controllers: [FavouritesController],
  providers: [FavouriteService],
  exports: [FavouriteService],
})
export class FavouritesModule {}
