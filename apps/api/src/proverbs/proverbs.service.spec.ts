import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { ProverbsService } from './proverbs.service';

jest.mock('../prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('ProverbsService', () => {
  let service: ProverbsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProverbsService,
        {
          provide: PrismaService,
          useValue: {
            proverb: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProverbsService>(ProverbsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
