import { Module } from '@nestjs/common';
import { IgdbService } from './igdb.service';

@Module({
  providers: [IgdbService],
  exports: [IgdbService],
})
export class IgdbModule {}
