import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsNumber,
} from 'class-validator';

export class FindBookDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  limit?: number;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  from?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  to?: number;
}
