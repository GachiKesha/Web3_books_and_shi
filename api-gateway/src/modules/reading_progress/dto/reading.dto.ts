import { IsInt, IsNumber, IsUUID, Max, Min, IsOptional } from 'class-validator';

export class UpdateReadingDto {
  @IsInt()
  @Min(0)
  current_page: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  percentage_read: number;
}

export class CreateReadingDto extends UpdateReadingDto {
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsUUID()
  book_id: string;
}
