import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reading } from '../../entities/reading.entity';
import { CreateReadingDto } from './dto/create-progress.dto';
import { UpdateReadingDto } from './dto/update-progress.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { timeout, catchError, throwError, firstValueFrom } from 'rxjs';
import { patterns } from '../patterns';

@Injectable()
export class ReadingService {
  private readonly logger = new Logger(ReadingService.name);

  constructor(
    @InjectRepository(Reading)
    private readonly readingRepository: Repository<Reading>,
    @Inject('USER_SERVICE')
    private readonly userClient: ClientProxy,

    @Inject('BOOK_SERVICE')
    private readonly bookClient: ClientProxy,
  ) {}

  async create(createReadingDto: CreateReadingDto): Promise<Reading> {
    this.logger.log(createReadingDto);
    const reading = this.readingRepository.create(createReadingDto);
    this.logger.log(reading);
    return this.readingRepository.save(reading);
  }

  async findAll(userId: string): Promise<Reading[]> {
    const readings = await this.readingRepository.find({
      where: { user_id: userId },
    });
    if (!readings) {
      throw new RpcException(
        new NotFoundException(`User with id ${userId} has no books in reading`),
      );
    }
    return readings;
  }

  async findOne(id: string): Promise<Reading> {
    const reading = await this.readingRepository.findOne({
      where: { id: id },
    });
    if (!reading) {
      throw new RpcException(
        new NotFoundException(`Reading with id ${id} not found`),
      );
    }
    return reading;
  }

  async findOneByBook(userId: string, bookId: string): Promise<Reading> {
    const reading = await this.readingRepository.findOne({
      where: {
        user_id: userId,
        book_id: bookId,
      },
    });
    if (!reading) {
      throw new RpcException(
        new NotFoundException(
          `Reading with book ${bookId} for user ${userId} not found`,
        ),
      );
    }
    return reading;
  }

  async update(
    id: string,
    updateReadingDto: UpdateReadingDto,
  ): Promise<Reading> {
    const reading = await this.findOne(id);
    Object.assign(reading, updateReadingDto);
    return this.readingRepository.save(reading);
  }

  async delete(id: string): Promise<void> {
    const reading = await this.findOne(id);
    await this.readingRepository.remove(reading);
  }

  async getRecommendations(userId: string) {
    const userReadings = await this.readingRepository.find({
      where: { user_id: userId, percentage_read: 100 },
    });
    if (userReadings.length === 0) return null;
    const bookIds = userReadings.map((r) => r.book_id);
    this.logger.log(`Books read: ${bookIds}`);
    return this.send(patterns.BOOK.RECOMMEND, bookIds, this.bookClient);
  }

  private send(pattern: any, data: any, client: ClientProxy): Promise<unknown> {
    const res$ = client.send(pattern, data).pipe(
      timeout(30000),
      catchError((e: any) => {
        this.logger.error(e);
        if (e.response) {
          return throwError(() => new RpcException(e.response));
        } else return throwError(() => e);
      }),
    );
    return firstValueFrom(res$);
  }
}
