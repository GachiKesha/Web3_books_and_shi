import { Controller, Body, Param, Post, Get, Put } from '@nestjs/common';
import { ReadingService } from './reading.service';
import { CreateReadingDto } from './dto/create-progress.dto';
import { UpdateReadingDto } from './dto/update-progress.dto';

@Controller('reading_progress')
export class ReadingController {
    constructor(private readonly readingService: ReadingService) {}

  @Post()
  async create(@Body() createReadingDto: CreateReadingDto) {
    return this.readingService.create(createReadingDto);
  }

  @Get(':userId')
  async findAll(@Param('userId') userId: string) {
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