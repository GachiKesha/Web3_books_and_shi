import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { RpcExceptionFilter } from './filters/rpc-exception.filter';
import amqp from 'amqp-connection-manager';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pack = require('./../package.json');
require('dotenv').config();

async function bootstrap() {
  
  const logger = new Logger('Validation'); 
  const app = await NestFactory.create(AppModule);
  // set global prefix for all routes
  app.setGlobalPrefix('api');
  // enable cors
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    transform: true, 
    forbidNonWhitelisted: true,  
    whitelist: true,
    exceptionFactory: (errors) => {
      logger.warn('Validation failed', JSON.stringify(errors, null, 4));
      return new BadRequestException({
        error: 'Bad Request',
        statusCode: 400,
      });
    }, 
  }));

  // connect to rabbitmq
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.BROKER_URI ?? 'amqp://guest:guest@rabbitmq:5672'],
      queue: pack.name,
      queueOptions: { durable: false },
    },
  });
  
  app.useGlobalFilters(new RpcExceptionFilter());
  
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
