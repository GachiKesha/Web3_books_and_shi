import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { Book } from '../../entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FindBookDto } from './dto/find-book.dto';

@Injectable()
export class BookService {
  private readonly logger = new Logger(BookService.name);

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }

  async findAll(filters: FindBookDto): Promise<Book[]> {
    const { page, limit, genre, author, from, to } = filters;
    const queryBuilder = this.bookRepository.createQueryBuilder('book');

    genre && queryBuilder.andWhere('book.genre = :genre', { genre });
    author && queryBuilder.andWhere('book.author = :author', { author });
    from && queryBuilder.andWhere('book.publication_year >= :from', { from });
    to && queryBuilder.andWhere('book.publication_year <= :to', { to });

    if (limit > 0) {
      queryBuilder.take(limit);
      queryBuilder.skip((page - 1) * limit);
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id: id },
    });
    if (!book) {
      throw new RpcException(
        new NotFoundException(`Book with id ${id} not found`),
      );
    }
    return book;
  }

  async findColumn(column: string): Promise<string[]> {
    const allowedCollumns: (keyof Book)[] = ['author', 'genre'];
    if (allowedCollumns.includes(column as keyof Book)) {
      var values = await this.bookRepository
        .createQueryBuilder('book')
        .select(`DISTINCT book.${column}`, column)
        .getRawMany();
      values = values.map((row) => row[column]);
      this.logger.log(values);
      return values;
    }
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id); // Validate if the book exists
    Object.assign(book, updateBookDto);
    return this.bookRepository.save(book);
  }

  async delete(id: string): Promise<void> {
    const book = await this.findOne(id); // Validate if the book exists
    await this.bookRepository.remove(book); // Remove the book from the repository
  }

  async recommend(ids: string[]): Promise<Book[]> {
    const books = await Promise.all(ids.map((id) => this.findOne(id)));
    const genres = books.map((book) => book.genre);
    const authors = books.map((book) => book.author);
    const genre = this.getMostCommon(genres);
    const author = this.getMostCommon(authors);

    const queryBuilder = this.bookRepository.createQueryBuilder('book');

    const primaryBooks = await queryBuilder
      .where('book.author = :author', { author })
      .andWhere('book.genre = :genre', { genre })
      .andWhere('book.id NOT IN (:...ids)', { ids })
      .getMany();

    const genreBooks = await queryBuilder
      .where('book.genre = :genre', { genre })
      .andWhere('book.id NOT IN (:...ids)', { ids })
      .limit(3)
      .getMany();

    const authorBooks = await queryBuilder
      .where('book.author = :author', { author })
      .andWhere('book.id NOT IN (:...ids)', { ids })
      .limit(3)
      .getMany();

    this.logger.log(
      `Both: ${primaryBooks}`,
      `genre: ${genreBooks}`,
      `authors: ${authorBooks}`,
    );

    return [...primaryBooks, ...genreBooks, ...authorBooks];
  }

  private getMostCommon(items) {
    let n = items.length;
    let freq = new Map();
    for (let i = 0; i < n; i++)
      freq.set(items[i], (freq.get(items[i]) || 0) + 1);

    let maxCnt = 0,
      res = null;
    for (let [val, cnt] of freq) {
      if (maxCnt < cnt || (cnt === maxCnt && val > res)) {
        res = val;
        maxCnt = cnt;
      }
    }

    return res;
  }
}
