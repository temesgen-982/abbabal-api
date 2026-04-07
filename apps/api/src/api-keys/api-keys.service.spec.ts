import { NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle.service';
import { ApiKeysService } from './api-keys.service';

describe('ApiKeysService', () => {
  let service: ApiKeysService;
  let mockDb: {
    insert: jest.Mock;
    select: jest.Mock;
    update: jest.Mock;
    query: { apiKeys: { findFirst: jest.Mock } };
  };

  beforeEach(() => {
    const returning = jest.fn();
    const where = jest.fn(() => ({ returning }));
    const set = jest.fn(() => ({ where }));
    const values = jest.fn(() => ({ returning }));
    const from = jest.fn(() => ({ where: jest.fn(() => ({ orderBy: jest.fn(() => ({ returning })) })), orderBy: jest.fn(() => ({ returning })) }));

    mockDb = {
      insert: jest.fn(() => ({ values })),
      select: jest.fn(() => ({ from })),
      update: jest.fn(() => ({ set })),
      query: { apiKeys: { findFirst: jest.fn() } },
    };

    service = new ApiKeysService({ db: mockDb } as unknown as DrizzleService);
  });

  it('creates an API key by storing the hash and returning the raw key once', async () => {
    const createdAt = new Date('2026-03-25T12:00:00.000Z');
    jest.spyOn(service, 'generateRawKey').mockReturnValue('raw-api-key');
    jest.spyOn(service, 'hashKey').mockReturnValue('hashed-api-key');

    const returning = jest.fn().mockResolvedValue([{ id: 11, name: 'Primary Key', createdAt }]);
    mockDb.insert.mockReturnValue({ values: jest.fn(() => ({ returning })) });

    await expect(service.create(5, 'Primary Key')).resolves.toEqual({
      id: 11,
      name: 'Primary Key',
      key: 'raw-api-key',
      createdAt,
    });
  });

  it('throws NotFoundException when revoking a missing API key', async () => {
    mockDb.query.apiKeys.findFirst.mockResolvedValue(null);
    await expect(service.revoke(5, 9)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns null for inactive API keys', async () => {
    jest.spyOn(service, 'hashKey').mockReturnValue('hashed-api-key');
    mockDb.query.apiKeys.findFirst.mockResolvedValue({ id: 2, isActive: false, user: { id: 5 } });
    await expect(service.validateKey('raw-api-key')).resolves.toBeNull();
  });

  it('returns the API key and updates lastUsedAt for active keys', async () => {
    const apiKey = { id: 2, name: 'Primary Key', userId: 5, isActive: true, user: { id: 5, username: 'admin' } };
    jest.spyOn(service, 'hashKey').mockReturnValue('hashed-api-key');
    mockDb.query.apiKeys.findFirst.mockResolvedValue(apiKey);

    const returning = jest.fn().mockResolvedValue([{ id: 2 }]);
    const where = jest.fn(() => ({ returning }));
    const set = jest.fn(() => ({ where }));
    mockDb.update.mockReturnValue({ set });

    await expect(service.validateKey('raw-api-key')).resolves.toBe(apiKey);
  });
});
