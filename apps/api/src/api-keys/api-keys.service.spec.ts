import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ApiKeysService } from './api-keys.service';

jest.mock('../prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('ApiKeysService', () => {
  let service: ApiKeysService;
  let prisma: {
    apiKey: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      apiKey: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };
    service = new ApiKeysService(prisma as unknown as PrismaService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates an API key by storing the hash and returning the raw key once', async () => {
    const createdAt = new Date('2026-03-25T12:00:00.000Z');

    jest.spyOn(service, 'generateRawKey').mockResolvedValue('raw-api-key');
    jest.spyOn(service, 'hashKey').mockResolvedValue('hashed-api-key');
    prisma.apiKey.create.mockResolvedValue({
      id: 11,
      name: 'Primary Key',
      createdAt,
    });

    await expect(service.create(5, 'Primary Key')).resolves.toEqual({
      id: 11,
      name: 'Primary Key',
      key: 'raw-api-key',
      createdAt,
    });
    expect(prisma.apiKey.create).toHaveBeenCalledWith({
      data: {
        name: 'Primary Key',
        key: 'hashed-api-key',
        userId: 5,
      },
    });
  });

  it('returns API keys for a user ordered by newest first', async () => {
    prisma.apiKey.findMany.mockResolvedValue([{ id: 1, name: 'Primary Key' }]);

    await expect(service.findAllForUser(5)).resolves.toEqual([
      { id: 1, name: 'Primary Key' },
    ]);
    expect(prisma.apiKey.findMany).toHaveBeenCalledWith({
      where: { userId: 5 },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  it('revokes an existing API key', async () => {
    prisma.apiKey.findUnique.mockResolvedValue({
      id: 9,
      userId: 5,
    });
    prisma.apiKey.update.mockResolvedValue({
      id: 9,
      name: 'Primary Key',
      isActive: false,
    });

    await expect(service.revoke(5, 9)).resolves.toEqual({
      id: 9,
      name: 'Primary Key',
      isActive: false,
    });
    expect(prisma.apiKey.update).toHaveBeenCalledWith({
      where: { id: 9 },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });
  });

  it('throws NotFoundException when revoking a missing API key', async () => {
    prisma.apiKey.findUnique.mockResolvedValue(null);

    await expect(service.revoke(5, 9)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.apiKey.update).not.toHaveBeenCalled();
  });

  it('returns null for inactive API keys', async () => {
    jest.spyOn(service, 'hashKey').mockResolvedValue('hashed-api-key');
    prisma.apiKey.findUnique.mockResolvedValue({
      id: 2,
      isActive: false,
      user: {
        id: 5,
        username: 'admin',
      },
    });

    await expect(service.validateKey('raw-api-key')).resolves.toBeNull();
    expect(prisma.apiKey.update).not.toHaveBeenCalled();
  });

  it('returns the API key and updates lastUsedAt for active keys', async () => {
    const apiKey = {
      id: 2,
      name: 'Primary Key',
      userId: 5,
      isActive: true,
      user: {
        id: 5,
        username: 'admin',
      },
    };

    jest.spyOn(service, 'hashKey').mockResolvedValue('hashed-api-key');
    prisma.apiKey.findUnique.mockResolvedValue(apiKey);
    prisma.apiKey.update.mockResolvedValue({
      id: 2,
    });

    await expect(service.validateKey('raw-api-key')).resolves.toBe(apiKey);
    expect(prisma.apiKey.findUnique).toHaveBeenCalledWith({
      where: { key: 'hashed-api-key' },
      include: { user: true },
    });
    expect(prisma.apiKey.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { lastUsedAt: expect.any(Date) },
    });
  });
});
