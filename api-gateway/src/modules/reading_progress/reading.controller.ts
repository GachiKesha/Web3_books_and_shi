import {
  Controller,
  Body,
  Param,
  Post,
  Get,
  Put,
  UseGuards,
  Request,
  Logger,
} from '@nestjs/common';
import { ReadingService } from './reading.service';
import { CreateReadingDto, UpdateReadingDto } from './dto/reading.dto';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('reading_progress')
export class ReadingController {
  constructor(private readonly readingService: ReadingService) {}
  private readonly logger = new Logger(ReadingController.name);

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createReadingDto: CreateReadingDto, @Request() req) {
    createReadingDto.user_id = req.user.member_id;
    return this.readingService.create(createReadingDto);
  }

  @UseGuards(AuthGuard)
  @Get('my')
  async findAll(@Request() req) {
    const userId = req.user.member_id;
    return this.readingService.findAll(userId);
  }

  @UseGuards(AuthGuard)
  @Get('get/:bookId')
  async findByBook(@Param('bookId') bookId: string, @Request() req) {
    const userId = req.user.member_id;
    return this.readingService.findByBook(userId, bookId);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReadingDto: UpdateReadingDto,
  ) {
    return this.readingService.update(id, updateReadingDto);
  }

  @UseGuards(AuthGuard)
  @Get('recommend')
  async getRecommendations(@Request() req) {
    const id = req.user.member_id;
    return this.readingService.getRecommendations(id);
  }
}
