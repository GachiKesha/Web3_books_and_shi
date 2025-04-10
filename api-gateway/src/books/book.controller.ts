import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.entity';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() book: Partial<Book>) {
    return this.bookService.create(book);
  }

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bookService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() update: Partial<Book>) {
    return this.bookService.update(+id, update);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.bookService.delete(+id);
  }
}
