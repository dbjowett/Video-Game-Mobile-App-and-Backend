import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, RefreshTokenDto } from './dto';
import { GoogleAuthGuard } from './guards/google-guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-guard';
import { LocalAuthGuard } from './guards/local-guard';
import { AuthenticatedRequest } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  async signIn(@Request() req: AuthenticatedRequest, @Res() res: Response) {
    const { access_token, refresh_token } = await this.authService.signIn(
      req.user,
      res,
    );

    return res.status(200).json({ access_token, refresh_token });
  }

  @Post('signup')
  async signUp(@Body() body: AuthDto) {
    const { email, password } = body;
    return this.authService.signUp(email, password);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(@Request() req: any, @Res() res: Response) {
    const tokens = await this.authService.refresh(req.user, res);
    return res.status(200).json(tokens);
  }

  @Post('logout')
  async logout(
    @Body() body: RefreshTokenDto,
    @Req() req: ExpressRequest,
    @Res() res: Response,
  ) {
    return this.authService.logout(
      req.cookies.refreshToken || body.refreshToken,
      res,
    );
  }

  // ** Google Auth  ** //
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    return { message: 'Redirecting to Google login...' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Query('state') state: string,
  ) {
    const { access_token, refresh_token } = await this.authService.signIn(
      req.user,
      res,
    );

    if (state === 'mobile') {
      res.redirect(
        `vg-app://login?token=${access_token}&refresh=${refresh_token}`, // Redirect to mobile app
      );
    } else {
      res.redirect(
        `${process.env.FE_URL}login?token=${access_token}`, // Redirect to web app
      );
    }
  }
}
