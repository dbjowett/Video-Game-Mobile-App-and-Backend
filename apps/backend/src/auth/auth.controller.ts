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
  async signIn(@Request() req: AuthenticatedRequest, @Res() res: Response) {
    const tokens = await this.authService.signIn(req.user, res);
    return res.status(200).json(tokens);
  }

  @Post('signup')
  async signUp(@Body() body: AuthDto) {
    const { email, password } = body;
    return this.authService.signUp(email, password);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
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
    return this.authService.logout(body.refreshToken, req, res);
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
    const { access_token, refresh_token } = await this.authService.signIn(
      req.user,
      res,
    );

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.redirect(`${process.env.FE_URL}/login?token=${access_token}`);
  }
}
