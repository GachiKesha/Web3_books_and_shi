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
    const { genre, author, from, to } = filters;
    const queryBuilder = this.bookRepository.createQueryBuilder('book');

    genre && queryBuilder.andWhere('book.genre = :genre', { genre });
    author && queryBuilder.andWhere('book.author = :author', { author });
    from && queryBuilder.andWhere('book.publication_year >= :from', { from });
    to && queryBuilder.andWhere('book.publication_year <= :to', { to });

    return queryBuilder.getMany();
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

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id); // Validate if the book exists
    Object.assign(book, updateBookDto);
    return this.bookRepository.save(book);
  }

  async delete(id: string): Promise<void> {
    const book = await this.findOne(id); // Validate if the book exists
    await this.bookRepository.remove(book); // Remove the book from the repository
  }
}
