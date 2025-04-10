import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: { email },
    });
  }
  async findById(userId: string): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: { id: userId },
    });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.databaseService.refreshToken.upsert({
      where: { userId },
      update: { token: refreshToken },
      create: { userId, token: refreshToken },
    });
  }

  async deleteRefreshTokenByUserId(userId: string): Promise<void> {
    await this.databaseService.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async create(
    email: string,
    password: string,
    username: string,
  ): Promise<User> {
    return this.databaseService.user.create({
      data: { email, password, username },
    });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: { googleId },
    });
  }

  async createGoogleUser(
    googleId: string,
    username: string,
    email: string,
  ): Promise<User> {
    return this.databaseService.user.create({
      data: {
        googleId,
        username,
        email,
      },
    });
  }
}
