import { IsUUID } from "class-validator";
import { UpdateReadingDto } from "./update-progress.dto";

export class CreateReadingDto extends UpdateReadingDto {
    @IsUUID()
    user_id: string;

    @IsUUID()
    book_id: string;
}