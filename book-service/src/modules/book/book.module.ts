import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book } from '../../entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book])], // Підключаємо Book entity
  controllers: [BookController], // Вказуємо контролер
  providers: [BookService], // Вказуємо сервіс
})
export class BookModule {}
