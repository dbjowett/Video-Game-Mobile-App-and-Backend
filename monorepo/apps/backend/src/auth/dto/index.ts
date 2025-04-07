import { Optional } from '@nestjs/common';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  // @IsEmail()
  email: string;

  @IsNotEmpty()
  // @IsStrongPassword()
  password: string;

  @Optional()
  username: string;

  @Optional()
  @IsBoolean()
  terms: boolean;
}

export class RefreshTokenDto {
  refreshToken: string;
}
