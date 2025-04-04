import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { JwtAccessStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

const JWT_CONFIG = {
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '5s' },
};

@Module({
  imports: [JwtModule.register(JWT_CONFIG), UsersModule],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshTokenStrategy,
    GoogleStrategy,
    UsersService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
