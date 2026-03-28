import { ApiKeysController } from './api-keys.controller';
import { ApiKeysService } from './api-keys.service';

jest.mock('../prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('ApiKeysController', () => {
  let controller: ApiKeysController;
  let apiKeysService: {
    create: jest.Mock;
    findAllForUser: jest.Mock;
    revoke: jest.Mock;
  };

  beforeEach(() => {
    apiKeysService = {
      create: jest.fn(),
      findAllForUser: jest.fn(),
      revoke: jest.fn(),
    };
    controller = new ApiKeysController(
      apiKeysService as unknown as ApiKeysService,
    );
  });

  it('creates an API key for the authenticated user', async () => {
    const response = {
      id: 1,
      name: 'Primary Key',
      key: 'raw-api-key',
      createdAt: new Date('2026-03-25T12:00:00.000Z'),
    };
    apiKeysService.create.mockResolvedValue(response);

    await expect(
      controller.create(
        { user: { id: 7 } },
        { name: 'Primary Key' },
      ),
    ).resolves.toEqual(response);
    expect(apiKeysService.create).toHaveBeenCalledWith(7, 'Primary Key');
  });

  it('lists API keys for the authenticated user', async () => {
    const response = [{ id: 1, name: 'Primary Key', isActive: true }];
    apiKeysService.findAllForUser.mockResolvedValue(response);

    await expect(controller.findAll({ user: { id: 7 } })).resolves.toEqual(
      response,
    );
    expect(apiKeysService.findAllForUser).toHaveBeenCalledWith(7);
  });

  it('converts the route id to a number when revoking an API key', async () => {
    const response = { id: 4, name: 'Primary Key', isActive: false };
    apiKeysService.revoke.mockResolvedValue(response);

    await expect(controller.revoke({ user: { id: 7 } }, '4')).resolves.toEqual(
      response,
    );
    expect(apiKeysService.revoke).toHaveBeenCalledWith(7, 4);
  });
});
