import { Module } from '@nestjs/common';
import { HltbModule } from 'src/hltb/hltb.module';
import { IgdbModule } from 'src/igdb/igdb.module';

import { GamesController } from './games.controller';
import { GamesService } from './games.service';

@Module({
  imports: [IgdbModule, HltbModule],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
