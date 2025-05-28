import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { patterns } from '../patterns';
import { ReadingService } from './reading.service';
import { CreateReadingDto } from './dto/create-progress.dto';
import { UpdateReadingDto } from './dto/update-progress.dto';

@Controller('reading_progress')
export class ReadingController {
  private readonly logger = new Logger(ReadingController.name);

  constructor(private readonly readingService: ReadingService) {}

  @MessagePattern(patterns.READING_PROGRESS.CREATE)
  async create(@Payload() createReadingDto: CreateReadingDto) {
    return this.readingService.create(createReadingDto);
  }

  @MessagePattern(patterns.READING_PROGRESS.FIND_ALL)
  async findAll(@Payload() userId: string) {
    return this.readingService.findAll(userId);
  }

  @MessagePattern(patterns.READING_PROGRESS.FIND_BY_BOOK)
  async findByBook(@Payload() data: { userId: string; bookId: string }) {
    return this.readingService.findOneByBook(data.userId, data.bookId);
  }

  @MessagePattern(patterns.READING_PROGRESS.UPDATE)
  async update(
    @Payload() data: { id: string; updateReadingDto: UpdateReadingDto },
  ) {
    const { id, updateReadingDto } = data;
    return this.readingService.update(id, updateReadingDto);
  }

  @MessagePattern(patterns.BOOK.RECOMMEND)
  async getRecommendations(@Payload() userId: string) {
    return this.readingService.getRecommendations(userId);
  }
}
