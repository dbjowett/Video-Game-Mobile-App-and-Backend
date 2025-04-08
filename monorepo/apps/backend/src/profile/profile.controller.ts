import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { AuthenticatedRequest } from 'src/auth/types';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Req() req: AuthenticatedRequest): Promise<unknown> {
    return await this.profileService.getUserProfile(req.user.id);
  }
}
