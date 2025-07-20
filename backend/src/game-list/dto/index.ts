import {
  IsArray,
  IsBooleanString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGameListDto {
  @IsString({ message: 'Title must be included' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsArray({ message: 'Game IDs must be an array' })
  @IsString({ each: true, message: 'Game IDs must be a string' })
  gameIds: string[];

  @IsBooleanString({ message: 'isPublic must be a boolean' })
  isPublic: boolean;
}

export class AddGameToListDto {
  @IsString({ message: 'Game List ID must be a string' })
  gameListId: string;

  @IsString({ message: 'Game List ID must be a string' })
  gameId: string;
}

export class RemoveGameFromListDto extends AddGameToListDto {}
