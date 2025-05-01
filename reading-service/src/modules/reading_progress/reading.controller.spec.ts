import { Test, TestingModule } from '@nestjs/testing';
import { ReadingController } from './reading.controller';
import { ReadingService } from './reading.service';
import { CreateReadingDto } from './dto/create-progress.dto';
import { UpdateReadingDto } from './dto/update-progress.dto';
import { patterns } from '../patterns';
import { v4 } from 'uuid';

describe('ReadingController', () => {
  let controller: ReadingController;
  let service: ReadingService;

  const mockReadingService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadingController],
      providers: [
        {
          provide: ReadingService,
          useValue: mockReadingService,
        },
      ],
    }).compile();

    controller = module.get<ReadingController>(ReadingController);
    service = module.get<ReadingService>(ReadingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe(`@MessagePattern(${patterns.READING_PROGRESS.CREATE})`, () => {
    it('should call service.create with the dto', async () => {
      const dto: CreateReadingDto = {
        user: v4(),
        book: v4(),
        current_page: 20,
        percentage_read: 25.5,
      };

      const expectedResult = { 
        id: v4(),
        user_id: dto.user,
        book_id: dto.book,
        current_page: dto.current_page,
        percentage_read: dto.percentage_read,
      };

      mockReadingService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('id');
      expect(result.user_id).toBe(dto.user);
      expect(result.book_id).toBe(dto.book);
      expect(result.current_page).toBe(dto.current_page);

    });
  });

  describe(`@MessagePattern(${patterns.READING_PROGRESS.FIND_ALL})`, () => {
    it('should call service.findAll with userId', async () => {
      const userId = v4();
      const expectedResult = [{ id: v4(), userId, bookId: v4() }];
      mockReadingService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(userId);

      expect(service.findAll).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe(`@MessagePattern(${patterns.READING_PROGRESS.UPDATE})`, () => {
    it('should call service.update with id and dto', async () => {
      const id = 'reading-1';
      const dto: UpdateReadingDto = {
        current_page: 50,
        percentage_read: 60.0,
      };
      const expectedResult = { id, ...dto };

      mockReadingService.update.mockResolvedValue(expectedResult);

      const result = await controller.update({ id, updateReadingDto: dto });

      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(expectedResult);
    });
  });
});
