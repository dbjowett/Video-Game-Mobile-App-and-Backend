import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/auth/types';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUserProfile(@Req() req: AuthenticatedRequest): Promise<unknown> {
    return await this.profileService.getUserProfile(req.user.id);
  }
}
