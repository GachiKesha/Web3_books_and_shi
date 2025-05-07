import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [BookController],
  providers: [
    BookService,
    {
      provide: 'BOOK_SERVICE',
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.BROKER_URI],
            queue: 'book-service',
            queueOptions: { durable: false },
          },
        }),
    },
  ],
})
export class BookModule {}
