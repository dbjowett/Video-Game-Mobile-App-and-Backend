import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/authguard';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { GamesController } from './games/games.controller';
import { GameService } from './games/games.service';
import { IgdbService } from './igdb/igdb.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsersModule, DatabaseModule],
  controllers: [AppController, GamesController, AuthController],
  providers: [
    AppService,
    IgdbService,
    GameService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },

    DatabaseService,
  ],
})
export class AppModule {}
