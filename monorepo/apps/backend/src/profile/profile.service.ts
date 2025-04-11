import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { omitFields } from 'src/utils';

const OMMITED_FIELDS: (keyof User)[] = ['password', 'updatedAt', 'googleId'];

@Injectable()
export class ProfileService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUserProfile(id: string): Promise<Partial<User>> {
    const user = await this.databaseService.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');
    return omitFields(user, OMMITED_FIELDS);
  }

  async updateUserProfile(
    userId: string,
    partialUser: Partial<Pick<User, 'profileImage' | 'username'>>,
  ): Promise<Partial<User>> {
    const updateData: Partial<Pick<User, 'profileImage' | 'username'>> = {};

    if (partialUser?.username) {
      updateData.username = partialUser.username;
    }

    if (partialUser?.profileImage) {
      updateData.profileImage = partialUser.profileImage;
    }

    const user = await this.databaseService.user.update({
      where: { id: userId },
      data: updateData,
    });

    return omitFields(user, OMMITED_FIELDS);
  }
}
