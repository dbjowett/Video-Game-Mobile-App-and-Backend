import { Body, Controller, Post } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { Public } from 'src/utils';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signin')
  async signIn(@Body() signInDto: Prisma.UserCreateInput) {
    return this.authService.signIn({
      email: signInDto.email,
      password: signInDto.password,
    });
  }

  @Public()
  @Post('signup')
  async signUp(@Body() signUpDto: Prisma.UserCreateInput) {
    return this.authService.signUp({
      email: signUpDto.email,
      password: signUpDto.password,
    });
  }
}
