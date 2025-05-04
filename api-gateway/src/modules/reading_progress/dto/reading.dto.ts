import { IsInt, IsNumber, IsUUID, Max, Min } from 'class-validator';

export class UpdateReadingDto {
  @IsInt()
  @Min(0)
  current_page: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  percentage_read: number;
}

export class CreateReadingDto extends UpdateReadingDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  book_id: string;
}
