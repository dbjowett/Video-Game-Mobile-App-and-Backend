import { Type } from 'class-transformer'; // Import the Type decorator
import { IsArray, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

class UserUpdateDto {
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  username?: string;

  @IsOptional()
  @IsString({ message: 'Profile image must be a string' })
  profileImage?: string;

  @IsOptional()
  @IsArray({ message: 'Preferred platform IDs must be an array' })
  @IsInt({ each: true, message: 'Each preferred platform ID must be an integer' })
  preferredPlatformIds?: number[];
}

export class UpdateProfileDto {
  @ValidateNested()
  @Type(() => UserUpdateDto)
  user: UserUpdateDto;
}
