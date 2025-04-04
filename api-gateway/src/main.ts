import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { RpcExceptionFilter } from './filters/rpc-exception.filter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pack = require('./../package.json');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // set global prefix for all routes
  app.setGlobalPrefix('api');
  // enable cors
  app.enableCors();

  // connect to rabbitmq
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.BROCKER_URI],
      queue: pack.name,
      queueOptions: { durable: false },
    },
  });
  
  app.useGlobalFilters(new RpcExceptionFilter());
  
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
