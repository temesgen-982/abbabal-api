import { Test, TestingModule } from '@nestjs/testing';
import { DrizzleService } from '../drizzle.service';
import { ProverbsService } from './proverbs.service';

describe('ProverbsService', () => {
  let service: ProverbsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProverbsService,
        { provide: DrizzleService, useValue: { db: {} } },
      ],
    }).compile();

    service = module.get<ProverbsService>(ProverbsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
