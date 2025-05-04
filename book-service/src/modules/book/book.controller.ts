import { Controller, Logger, Body, Param, Query} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { patterns } from '../patterns';
import { FindBookDto } from './dto/find-book.dto';

@Controller('books')
export class BookController {
  private readonly logger = new Logger(BookController.name);

  constructor(private readonly bookService: BookService) {}

  @MessagePattern(patterns.BOOK.CREATE)
  async create(@Payload() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @MessagePattern(patterns.BOOK.FIND_ALL)
  async findAll(@Payload() filters: FindBookDto) {
    return this.bookService.findAll(filters);    
  }

  @MessagePattern(patterns.BOOK.FIND_BY_ID)
  async findOne(@Payload() data:{ id: string }) {
    return this.bookService.findOne(data.id);
  }

  @MessagePattern(patterns.BOOK.UPDATE)
  async update(@Payload() data: { id: string, updateBookDto: UpdateBookDto}) {
    const { id, updateBookDto } = data;
    return this.bookService.update(id, updateBookDto);
  }  
}
