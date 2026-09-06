import { Module } from '@nestjs/common';

import { HltbService } from './hltb.service';

@Module({
  providers: [HltbService],
  exports: [HltbService],
})
export class HltbModule {}
