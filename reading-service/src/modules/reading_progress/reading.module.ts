import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReadingController } from "./reading.controller";
import { Reading } from "../../entities/reading.entity";
import { ReadingService } from "./reading.service";

@Module({
    imports: [TypeOrmModule.forFeature([Reading])],
    controllers: [ReadingController],
    providers: [ReadingService],
})
export class ReadingModule {}