import {
  Controller,
  Body,
  Param,
  Post,
  Get,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReadingService } from './reading.service';
import { CreateReadingDto, UpdateReadingDto } from './dto/reading.dto';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('reading_progress')
export class ReadingController {
  constructor(private readonly readingService: ReadingService) {}

  @Post()
  async create(@Body() createReadingDto: CreateReadingDto) {
    return this.readingService.create(createReadingDto);
  }

  @UseGuards(AuthGuard)
  @Get('my')
  async findAll(@Request() req) {
    const userId = req.user.member_id;
    return this.readingService.findAll(userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReadingDto: UpdateReadingDto,
  ) {
    return this.readingService.update(id, updateReadingDto);
  }
}
