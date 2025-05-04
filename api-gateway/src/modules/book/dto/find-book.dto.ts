import { IsOptional, IsString, IsInt, Min, Max } from "class-validator";

export class FindBookDto {
    @IsOptional()
    @IsString()
    genre?: string;

    @IsOptional()
    @IsString()
    author?: string;

    @IsOptional()
    @IsInt()
    @Min(1000)
    @Max(new Date().getFullYear())
    from?: number;

    @IsOptional()
    @IsInt()
    @Min(1000)
    @Max(new Date().getFullYear())
    to?: number;
}