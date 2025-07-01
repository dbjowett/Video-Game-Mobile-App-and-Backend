import { Type } from 'class-transformer'; // Import the Type decorator
import { IsOptional, IsString, ValidateNested } from 'class-validator';

class UserUpdateDto {
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  username?: string;

  @IsOptional()
  @IsString({ message: 'Profile image must be a string' })
  profileImage?: string;
}

export class UpdateProfileDto {
  @ValidateNested()
  @Type(() => UserUpdateDto)
  user: UserUpdateDto;
}
