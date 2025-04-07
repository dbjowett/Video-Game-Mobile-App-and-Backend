import { IsIn, IsOptional, IsString } from 'class-validator';

export class ExploreQueryDto {
  @IsOptional()
  @IsString()
  query: string;

  @IsOptional()
  @IsIn(['relevance', 'rating', 'date'])
  sort: string;

  @IsOptional()
  @IsString()
  category: string;
}
