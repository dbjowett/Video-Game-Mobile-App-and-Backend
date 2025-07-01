import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class AuthDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty()
  // @IsStrongPassword() // TODO: Comment this in for prod
  password: string;

  @IsNotEmpty({ message: 'Username is required' })
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
  username: string;
}

export class RefreshTokenDto {
  refreshToken: string;
}
