import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await argon2.verify(user.password, password))) {
      const { password, ...safeUser } = user;
      return safeUser;
    }
    return null;
  }

  async signIn(user: Omit<User, 'password'>): Promise<{ message: string }> {
    return {
      message: `Welcome ${user.email}! You are now signed in.`,
    };
  }

  async signUp(email: string, password: string): Promise<{ message: string }> {
    const hashedPassword = await argon2.hash(password);
    await this.usersService.create(email, hashedPassword);
    return {
      message: `User ${email} registered successfully.`,
    };
  }

  async validateGoogleUser(
    googleId: string,
    name: string,
    email: string,
  ): Promise<Omit<User, 'password'>> {
    let user = await this.usersService.findByGoogleId(googleId);

    if (!user) {
      user = await this.usersService.createGoogleUser(googleId, name, email);
    }

    const { password, ...result } = user;
    return result;
  }

  async deserializeUser(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findById(id);
    if (!user) return null;

    const { password, ...result } = user;
    return result;
  }
}
