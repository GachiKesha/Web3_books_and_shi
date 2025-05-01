import { Module } from '@nestjs/common';
import { ReadingModule } from './reading_progress/reading.module';
import { OrmModule } from './orm/orm.module';

@Module({
  imports: [ReadingModule, OrmModule],
})
export class ModulesModule {}
