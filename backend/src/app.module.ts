import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { GamesController } from './games/games.controller';
import { GameService } from './games/games.service';
import { IgdbService } from './igdb/igdb.service';
import { ProfileModule } from './profile/profile.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    DatabaseModule,
    ProfileModule,
  ],
  controllers: [AppController, GamesController, AuthController],
  providers: [
    AppService,
    IgdbService,
    GameService,
    AuthService,
    DatabaseService,
  ],
})
export class AppModule {}
