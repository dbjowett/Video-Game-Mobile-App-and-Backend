import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }

  serializeUser(user: User, done: CallableFunction): void {
    done(null, user.id);
  }

  async deserializeUser(userId: string, done: CallableFunction): Promise<void> {
    try {
      const user = await this.authService.deserializeUser(userId);
      done(null, user || null);
    } catch (err) {
      done(err);
    }
  }
}
