import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });
    return user;
  }

  async create(email: string, password: string): Promise<User> {
    const user = await this.databaseService.user.create({
      data: { email, password },
    });
    return user;
  }
}
