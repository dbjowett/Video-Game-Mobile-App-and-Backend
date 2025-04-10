import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import argon2 from 'argon2';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { Tokens, UserPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async hashData(data: string): Promise<string> {
    return await argon2.hash(data);
  }

  async verifyData(hashedData: string, data: string): Promise<boolean> {
    return await argon2.verify(hashedData, data);
  }

  setCookie(res: Response, refresh_token: string): void {
    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  async getTokens(user: UserPayload): Promise<Tokens> {
    const payload = { sub: user.id, email: user.email };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    ]);

    return { access_token, refresh_token };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await this.verifyData(user.password, password))) {
      const { password, ...safeUser } = user;
      return safeUser;
    }
    return null;
  }

  async signIn(user: UserPayload, res: Response): Promise<Tokens> {
    const { access_token, refresh_token } = await this.getTokens(user);

    await this.usersService.updateRefreshToken(user.id, refresh_token);
    this.setCookie(res, refresh_token);

    return { access_token, refresh_token };
  }

  async signUp(
    email: string,
    password: string,
    username: string,
  ): Promise<Tokens> {
    try {
      const hashedPassword = await this.hashData(password);
      const user = await this.usersService.create(
        email,
        hashedPassword,
        username,
      );
      const { access_token, refresh_token } = await this.getTokens(user);
      await this.usersService.updateRefreshToken(user.id, refresh_token);

      return { access_token, refresh_token };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already in use');
      } else {
        throw new Error('Unknown error occured creating user');
      }
    }
  }

  async refresh(user: UserPayload, res: Response): Promise<Tokens> {
    const newPayload = { sub: user.id, email: user.email };

    const [new_access_token, new_refresh_token] = await Promise.all([
      this.jwtService.signAsync(newPayload, { expiresIn: '15m' }),
      this.jwtService.signAsync(newPayload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    ]);

    await this.usersService.updateRefreshToken(user.id, new_refresh_token);
    this.setCookie(res, new_refresh_token);

    return { access_token: new_access_token, refresh_token: new_refresh_token };
  }

  async logout(userId: string | undefined, res: Response): Promise<void> {
    try {
      await this.usersService.deleteRefreshTokenByUserId(userId);

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
  }
  // ** Google Auth  ** //
  async validateGoogleUser(
    googleId: string,
    username: string,
    email: string,
  ): Promise<Omit<User, 'password'>> {
    let user = await this.usersService.findByGoogleId(googleId);

    if (!user) {
      user = await this.usersService.createGoogleUser(
        googleId,
        username,
        email,
      );
    }

    const { password, ...result } = user;
    return result;
  }
}
