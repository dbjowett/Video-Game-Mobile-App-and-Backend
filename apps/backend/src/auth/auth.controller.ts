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
import { Request as ExpressRequest, Response } from 'express';
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

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Request() req: any, @Res() res: Response) {
    return this.authService.refresh(req.user, res);
  }

  @Post('logout')
  async logout(
    @Body() body: RefreshTokenDto,
    @Req() req: ExpressRequest,
    @Res() res: Response,
  ) {
    const refreshToken = body.refreshToken || req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token not provided' });
    }

    try {
      await this.authService.logout(refreshToken);

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
      return res
        .status(401)
        .json({ message: 'Invalid or expired refresh token' });
    }
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
