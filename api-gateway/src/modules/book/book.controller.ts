import {
  Controller,
  Body,
  Param,
  Post,
  Get,
  Put,
  Query,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FindBookDto } from './dto/find-book.dto';
import { Response } from 'express';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  async findAll(@Query() filters: FindBookDto) {
    return this.bookService.findAll(filters);
  }

  @Get('/column/:column')
  async findColumn(@Param('column') column: string) {
    return this.bookService.findColumn(column);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Get('covers/:id')
  async getCover(@Param('id') id: string, @Res() res: Response) {
    try {
      const base64 = (await this.bookService.getCover(id)) as string;
      if (!base64) throw new Error();

      const buffer = Buffer.from(base64, 'base64');
      res.set({
        'Content-Type': 'image/jpeg',
        'Content-Length': buffer.length,
      });

      res.end(buffer);
    } catch (err) {
      throw new NotFoundException(`Cover for book ${id} not found`);
    }
  }
}
