import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Reading } from "../../entities/reading.entity";
import { CreateReadingDto } from './dto/create-progress.dto';
import { UpdateReadingDto } from './dto/update-progress.dto';
import { RpcException } from "@nestjs/microservices";
import { assert } from "console";
import { read } from "fs";

@Injectable()
export class ReadingService {
    private readonly logger = new Logger(ReadingService.name);

    constructor(
        @InjectRepository(Reading)
        private readonly readingRepository: Repository<Reading>,
    ) {}
    
    async create(createReadingDto: CreateReadingDto): Promise<Reading> {
        this.logger.log(createReadingDto);
        const reading = this.readingRepository.create(createReadingDto);
        this.logger.log(reading);
        return this.readingRepository.save(reading);
    }

    async findAll(userId: string): Promise<Reading[]> {
        const readings = await this.readingRepository.find({
            where: { user_id: userId}
        });
        if (!readings) {
            throw new RpcException(new NotFoundException(`User with id ${userId} has no books in reading`));
        }
        return readings;
    }

    async findOne(id: string): Promise<Reading> {
        const reading = await this.readingRepository.findOne({
          where: { id: id }, 
        });    
        if (!reading) {
            throw new RpcException(new NotFoundException(`Reading with id ${id} not found`))
        }
        return reading;
      }

    async update(id: string, updateReadingDto: UpdateReadingDto): Promise<Reading> {
        const reading = await this.findOne(id);
        Object.assign(reading, updateReadingDto);
        return this.readingRepository.save(reading);
    }

    async delete(id: string): Promise<void> {
        const reading = await this.findOne(id);
        await this.readingRepository.remove(reading);
    }
}