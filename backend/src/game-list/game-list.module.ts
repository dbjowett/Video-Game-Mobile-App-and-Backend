import { Module } from '@nestjs/common';
import { GamesModule } from 'src/games/games.module';
import { GameListController } from './game-list.controller';
import { GameListService } from './game-list.service';

@Module({
  imports: [GamesModule],
  controllers: [GameListController],
  providers: [GameListService],
  exports: [GameListService],
})
export class FavouritesModule {}
