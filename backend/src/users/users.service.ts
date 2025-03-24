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

  async create(email: string, password: string): Promise<User> {
    return this.databaseService.user.create({
      data: { email, password },
    });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: { googleId },
    });
  }

  async createGoogleUser(
    googleId: string,
    name: string,
    email: string,
  ): Promise<User> {
    return this.databaseService.user.create({
      data: {
        googleId,
        name,
        email,
      },
    });
  }
}
