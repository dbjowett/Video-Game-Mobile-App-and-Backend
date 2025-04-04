import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, RefreshTokenDto } from './dto';
import { AuthenticatedRequest } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @UseGuards(AuthGuard('local'))
  async signIn(@Request() req: AuthenticatedRequest, res: Response) {
    return this.authService.signIn(req.user, res);
  }

  @Post('signup')
  async signUp(@Body() body: AuthDto) {
    const { email, password } = body;
    return this.authService.signUp(email, password);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDto, @Res() res: Response) {
    const { refreshToken } = body;
    return this.authService.refresh(refreshToken, res);
  }

  @Post('logout')
  async logout(@Body() body: RefreshTokenDto) {
    const { refreshToken } = body;
    return this.authService.logout(refreshToken);
  }

  // ** Google Auth  ** //
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    return { message: 'Redirecting to Google login...' };
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const { access_token } = await this.authService.signIn(req.user, res);
    res.redirect(process.env.FE_URL + `?token=${access_token}`);
  }
}
