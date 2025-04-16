import { IsIn, IsOptional, IsString } from 'class-validator';

export class ExploreQueryDto {
  @IsOptional()
  @IsString()
  q: string;

  @IsOptional()
  @IsIn(['relevance', 'rating', 'date'])
  sort: string;

  @IsOptional()
  @IsString()
  category: string;
}

export class SearchGamesDto {
  @IsString()
  q: string;

  // @IsOptional()
  // @IsIn(['relevance', 'rating', 'date'])
  // sort: string;

  // @IsOptional()
  // @IsString()
  // category: string;
}
