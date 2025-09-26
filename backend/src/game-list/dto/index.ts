import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
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
  @ArrayNotEmpty({ message: 'At least one game ID must be provided' })
  @Type(() => Number)
  @IsInt({ each: true, message: 'Each game ID must be an integer' })
  gameIds: number[];

  @Type(() => Boolean)
  @IsBoolean({ message: 'isPublic must be a boolean' })
  isPublic: boolean;
}

export class AddGameToListDto {
  @IsString({ message: 'Game List ID must be a string' })
  gameListId: string;

  @IsInt({ message: 'Game ID must be a number' })
  @Type(() => Number)
  gameId: number;
}

export class UpdateListOrderDto {
  @IsInt({ message: 'To must be a number' })
  @Type(() => Number)
  to: number;

  @IsInt({ message: 'From must be a number' })
  @Type(() => Number)
  from: number;
}

export class RemoveGameFromListDto extends AddGameToListDto {}
