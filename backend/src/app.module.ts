import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { GamesController } from './games/games.controller';
import { GameService } from './games/games.service';
import { IgdbService } from './igdb/igdb.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsersModule],
  controllers: [AppController, GamesController, AuthController],
  providers: [AppService, IgdbService, GameService, AuthService],
})
export class AppModule {}
