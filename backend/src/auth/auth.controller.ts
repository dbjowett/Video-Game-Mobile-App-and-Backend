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
import { User } from '@prisma/client';
import { Public } from 'src/utils';
import { AuthService } from './auth.service';

export interface AuthenticatedRequest extends Request {
  user: Omit<User, 'password'>;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @UseGuards(AuthGuard('local'))
  async signIn(@Request() req: AuthenticatedRequest) {
    return this.authService.signIn(req.user);
  }

  @Public()
  @Post('signup')
  async signUp(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.signUp(email, password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    return { message: 'Redirecting to Google login...' };
  }

  @Get('session')
  getSession(@Req() req) {
    console.log('Session:', req.session);
    console.log('User in session:', req.user);
    return {
      session: req.session,
      user: req.user,
    };
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    if (req.user) {
      req.login(req.user, (err: Error) => {
        if (err)
          return res.redirect(process.env.FE_URL + 'login?error=login_failed');
        res.redirect(process.env.FE_URL + 'home');
      });
    } else {
      res.redirect(process.env.FE_URL + 'login?error=not_logged_in');
    }
  }
}
