import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { UserPayload } from 'src/auth/types';
import { User } from 'src/common/utils/user.decorator';
import { UpdateProfileDto } from './dto';
import { ProfileService } from './profile.service';
import { User as UserType } from './types';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getUserProfile(@User() user: UserPayload): Promise<Partial<UserType>> {
    return await this.profileService.getUserProfile(user.id);
  }

  @Patch()
  async updateUserProfile(
    @User() user: UserPayload,
    @Body() body: UpdateProfileDto,
  ): Promise<Partial<UserType>> {
    return await this.profileService.updateUserProfile(user.id, body.user);
  }

  @Get('/profile-upload-url')
  async getProfileUploadUrl() {
    return this.profileService.getProfileUploadUrl();
  }
}
