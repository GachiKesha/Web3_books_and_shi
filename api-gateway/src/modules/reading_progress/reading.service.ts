import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { timeout, catchError, throwError, firstValueFrom } from 'rxjs';

import { CreateReadingDto, UpdateReadingDto } from './dto/reading.dto';
import { patterns } from '../patterns';

@Injectable()
export class ReadingService {
  private readonly logger = new Logger(ReadingService.name);

  constructor(
    @Inject('READING_SERVICE') private readonly readingClient: ClientProxy,
  ) {}

  private send(pattern: any, data: any): Promise<unknown> {
    const res$ = this.readingClient.send(pattern, data).pipe(
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

  async create(createReadingDto: CreateReadingDto) {
    this.logger.log('Creating reading progress');
    return this.send(patterns.READING_PROGRESS.CREATE, createReadingDto);
  }

  async findAll(userId: string) {
    return this.send(patterns.READING_PROGRESS.FIND_ALL, userId);
  }

  async update(id: string, updateReadingDto: UpdateReadingDto) {
    this.logger.log(`Updating reading progress by id: ${id}`);
    return this.send(patterns.READING_PROGRESS.UPDATE, {
      id,
      updateReadingDto,
    });
  }
}
