import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingController } from './reading.controller';
import { Reading } from '../../entities/reading.entity';
import { ReadingService } from './reading.service';
import {
  ClientProxyFactory,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';

@Module({
  imports: [TypeOrmModule.forFeature([Reading])],
  controllers: [ReadingController],
  providers: [
    ReadingService,
    {
      provide: 'USER_SERVICE',
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.BROKER_URI],
            queue: 'user-service',
            queueOptions: { durable: false },
          },
        } as RmqOptions),
    },
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
        } as RmqOptions),
    },
  ],
})
export class ReadingModule {}
