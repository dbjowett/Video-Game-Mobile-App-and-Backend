import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './auth.serializer';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  providers: [
    AuthService,
    SessionSerializer,
    LocalStrategy,
    GoogleStrategy,
    UsersService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
