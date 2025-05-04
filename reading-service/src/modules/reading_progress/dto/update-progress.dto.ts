import { IsInt, IsNumber, Max, Min } from 'class-validator';

export class UpdateReadingDto {
  @IsInt()
  @Min(0)
  current_page: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  percentage_read: number;
}
