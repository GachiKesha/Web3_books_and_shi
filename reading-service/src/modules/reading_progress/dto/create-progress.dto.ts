import { IsUUID } from "class-validator";
import { UpdateReadingDto } from "./update-progress.dto";

export class CreateReadingDto extends UpdateReadingDto {
    @IsUUID()
    user: string;

    @IsUUID()
    book: string;
}