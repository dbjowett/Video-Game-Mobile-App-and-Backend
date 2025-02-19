import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const { email, password, terms } = signInDto;

    // Find the user by email
    const user = await this.usersService.findOne(email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException();
    }

    // Create the payload for JWT
    const payload = { sub: user.userId, username: user.username };

    // Return the JWT token
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
