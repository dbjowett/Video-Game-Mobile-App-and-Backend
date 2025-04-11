import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id: googleId, displayName: username, emails, photos } = profile;

    const profileImage = photos?.[0]?.value; // undefined if not available
    const email = emails[0].value;

    const user = await this.authService.validateGoogleUser({
      googleId,
      username,
      email,
      profileImage,
    });

    if (!user) return done(new UnauthorizedException(), null);
    return done(null, user);
  }
}
