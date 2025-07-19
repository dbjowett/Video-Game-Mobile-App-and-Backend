import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { FavouritesModule } from './game-list/game-list.module';
import { GamesModule } from './games/games.module';

import { IgdbModule } from './igdb/igdb.module';
import { ProfileModule } from './profile/profile.module';
import { UsersModule } from './users/users.module';

import { validationSchema } from './common/config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema,
    }),
    AuthModule,
    UsersModule,
    DatabaseModule,
    ProfileModule,
    GamesModule,
    IgdbModule,
    FavouritesModule,
  ],
})
export class AppModule {}
