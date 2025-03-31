import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProfileService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUserProfile(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.databaseService.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');
    const { password, ...rest } = user;
    return rest;
  }
}
