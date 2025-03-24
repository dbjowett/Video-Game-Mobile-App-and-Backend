import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const { email, password } = signInDto;
    const user = await this.usersService.findByEmail(email);

    if (!user || !argon2.verify(user.password, password)) {
      console.log('User not found');
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signInDto: SignInDto): Promise<{ access_token: string }> {
    const { email, password } = signInDto;
    const hashedPassword = await argon2.hash(password);
    const user = await this.usersService.create(email, hashedPassword);
    const payload = { sub: user.id, username: user.email };
    // generate response
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
