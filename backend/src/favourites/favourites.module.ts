import { Module } from '@nestjs/common';
import { FavouritesController } from './favourites.controller';
import { FavouriteService } from './favourites.service';

@Module({
  controllers: [FavouritesController],
  providers: [FavouriteService],
  exports: [FavouriteService],
})
export class FavouritesModule {}
