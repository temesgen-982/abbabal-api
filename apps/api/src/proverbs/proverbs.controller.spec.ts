import { ProverbsController } from './proverbs.controller';
import { ProverbsService } from './proverbs.service';

describe('ProverbsController', () => {
  let controller: ProverbsController;

  beforeEach(() => {
    controller = new ProverbsController({
      findAll: jest.fn(),
      search: jest.fn(),
      random: jest.fn(),
      findOne: jest.fn(),
    } as unknown as ProverbsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
