import { Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ReadingController } from "./reading.controller";
import { ReadingService } from "./reading.service";

@Module({
    controllers: [ReadingController],
    providers: [
        ReadingService,
        {
            provide: 'READING_SERVICE',
            useFactory: () =>
                ClientProxyFactory.create({
                    transport: Transport.RMQ,
                    options: {
                      urls: [process.env.BROKER_URI],
                      queue: 'reading-service',
                      queueOptions: { durable: false },
                    },
                  }),
        },
    ],
})
export class ReadingModule {}