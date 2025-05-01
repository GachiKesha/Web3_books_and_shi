import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './modules/book/book.module';
import { UserModule } from './modules/user/user.module'; 
import { ReadingModule } from './modules/reading_progress/reading.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    UserModule,
    BookModule,
    ReadingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
