import { IsString, IsOptional, IsInt, Min, Max } from "class-validator";

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  genre: string;

  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  publication_year: number;
}

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  publication_year?: number;
}
