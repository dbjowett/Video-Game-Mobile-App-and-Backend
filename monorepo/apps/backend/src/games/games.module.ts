import { Module } from '@nestjs/common';
import { IgdbModule } from 'src/igdb/igdb.module';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

@Module({
  imports: [IgdbModule],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
