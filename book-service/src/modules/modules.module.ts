import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { OrmModule } from './orm/orm.module';

@Module({
  imports: [BookModule, OrmModule],
})
export class ModulesModule {}
