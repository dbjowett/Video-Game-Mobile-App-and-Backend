import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { omitFields } from 'src/common/utils';
import { DatabaseService } from 'src/database/database.service';

const OMMITED_FIELDS = ['password', 'updatedAt', 'googleId'] as const satisfies (keyof User)[];

@Injectable()
export class ProfileService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getProfileUploadUrl(): Promise<string> {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new PutObjectCommand({
      // ? is this correct
      Bucket: process.env.AWS_BUCKET,
      Key: `profile-images/${Date.now()}.jpg`,
      ContentLength: 200,
      ContentType: 'image/*',
    });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }

  async getUserProfile(id: string): Promise<Omit<User, (typeof OMMITED_FIELDS)[number]>> {
    const user = await this.databaseService.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');
    return omitFields(user, OMMITED_FIELDS);
  }

  async updateUserProfile(
    userId: string,
    partialUser: Partial<Pick<User, 'profileImage' | 'username' | 'preferredPlatformIds'>>,
  ): Promise<Omit<User, (typeof OMMITED_FIELDS)[number]>> {
    const updateData: Partial<Pick<User, 'profileImage' | 'username' | 'preferredPlatformIds'>> =
      {};

    if (partialUser?.username) {
      updateData.username = partialUser.username;
    }

    if (partialUser?.profileImage) {
      updateData.profileImage = partialUser.profileImage;
    }

    if (partialUser?.preferredPlatformIds !== undefined) {
      updateData.preferredPlatformIds = partialUser.preferredPlatformIds;
    }

    const user = await this.databaseService.user.update({
      where: { id: userId },
      data: updateData,
    });

    return omitFields(user, OMMITED_FIELDS);
  }
}
