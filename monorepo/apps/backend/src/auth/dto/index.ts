import { Optional } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  // @IsEmail()
  email: string;

  @IsNotEmpty()
  // @IsStrongPassword()
  password: string;

  @Optional()
  username: string;
}

export class RefreshTokenDto {
  refreshToken: string;
}
