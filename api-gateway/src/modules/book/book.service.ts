import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { timeout, catchError, throwError, firstValueFrom } from 'rxjs';

import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FindBookDto } from './dto/find-book.dto';
import { patterns } from '../patterns';

@Injectable()
export class BookService {
  private readonly logger = new Logger(BookService.name);

  constructor(
    @Inject('BOOK_SERVICE') private readonly bookClient: ClientProxy,
  ) {}

  private send(pattern: any, data: any): Promise<unknown> {
    const res$ = this.bookClient.send(pattern, data).pipe(
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

  async create(createBookDto: CreateBookDto) {
    this.logger.log('Creating book');
    return this.send(patterns.BOOK.CREATE, createBookDto);
  }

  async findColumn(column: string) {
    this.logger.log(`Returning ${column}`);
    return this.send(patterns.BOOK.FIND_COLUMN, column);
  }

  async findAll(filters: FindBookDto) {
    this.logger.log('Returning books');
    return this.send(patterns.BOOK.FIND_ALL, filters);
  }

  async findOne(id: string) {
    this.logger.log(`Finding book by id: ${id}`);
    return this.send(patterns.BOOK.FIND_BY_ID, { id });
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    this.logger.log(`Updating book by id: ${id}`);
    return this.send(patterns.BOOK.UPDATE, { id, updateBookDto });
  }

  async delete(id: string) {
    this.logger.log(`Deleting book by id: ${id}`);
    return this.send(patterns.BOOK.DELETE, { id });
  }

  async getCover(id: string) {
    this.logger.log(`Cover for ${id}`);
    return this.send('get_cover', id);
  }
}
