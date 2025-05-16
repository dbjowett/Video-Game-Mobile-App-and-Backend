import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { FavouritesModule } from './favourites/favourites.module';
import { GamesModule } from './games/games.module';

import { IgdbModule } from './igdb/igdb.module';
import { ProfileModule } from './profile/profile.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
