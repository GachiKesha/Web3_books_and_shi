import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from '../../entities/book.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('BookService', () => {
  let service: BookService;
  let repository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto = {
        title: 'Book Title',
        author: 'Author',
        genre: 'Genre',
        publication_year: 2021,
      };
      const result = {
        id: '1',
        title: 'Book Title',
        author: 'Author',
        genre: 'Genre',
        description: 'Description of the book',
        publication_year: 2021, // Додаємо поле publication_year
        file_url: 'http://example.com/book1.pdf', // Додаємо поле file_url
        created_at: new Date(),
      };

      jest.spyOn(repository, 'create').mockReturnValue(result as any);
      jest.spyOn(repository, 'save').mockResolvedValue(result);

      expect(await service.create(createBookDto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const result = [
        {
          id: '1',
          title: 'Book Title',
          author: 'Author',
          description: 'Description of the book',
          genre: 'Genre',
          publication_year: 2021, // Додаємо поле publication_year
          file_url: 'http://example.com/book1.pdf', // Додаємо поле file_url
          created_at: new Date(),
        },
        {
          id: '2',
          title: 'Another Book',
          author: 'Another Author',
          description: 'Another description',
          genre: 'Another genre',
          publication_year: 2020, // Додаємо поле publication_year
          file_url: 'http://example.com/book2.pdf', // Додаємо поле file_url
          created_at: new Date(),
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.findAll({})).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const result = {
        id: '1',
        title: 'Book Title',
        author: 'Author',
        description: 'Description of the book',
        genre: 'Genre',
        publication_year: 2021, // Додаємо поле publication_year
        file_url: 'http://example.com/book1.pdf', // Додаємо поле file_url
        created_at: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(result as any);

      expect(await service.findOne('1')).toEqual(result);
    });

    it('should throw a NotFoundException if the book is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const existingBook = {
        id: '1',
        title: 'Old Title',
        author: 'Old Author',
        description: 'Old Description',
        genre: 'Old Genre',
        publication_year: 2000, // Додаємо поле publication_year
        file_url: 'http://example.com/old_book.pdf', // Додаємо поле file_url
        created_at: new Date(),
      };
      const updateBookDto = {
        title: 'Updated Title',
        genre: 'Updated Genre',
        year: 2022,
      };
      const updatedBook = {
        id: '1',
        ...updateBookDto,
        author: 'Old Author',
        description: 'Old Description',
        publication_year: 2022, // Додаємо поле publication_year
        file_url: 'http://example.com/updated_book.pdf', // Додаємо поле file_url
        created_at: new Date(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingBook);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedBook);

      expect(await service.update('1', updateBookDto)).toEqual(updatedBook);
    });

    it('should throw a NotFoundException if the book is not found for update', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(
        service.update('1', { title: 'Updated Title' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a book', async () => {
      const book = {
        id: '1',
        title: 'Book Title',
        author: 'Author',
        description: 'Description of the book',
        genre: 'Genre',
        publication_year: 2021, // Додаємо поле publication_year
        file_url: 'http://example.com/book1.pdf', // Додаємо поле file_url
        created_at: new Date(),
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(book);
      jest.spyOn(repository, 'remove').mockResolvedValue(undefined);

      await expect(service.delete('1')).resolves.not.toThrow();
    });

    it('should throw a NotFoundException if the book is not found for deletion', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.delete('1')).rejects.toThrow(NotFoundException);
    });
  });
});
