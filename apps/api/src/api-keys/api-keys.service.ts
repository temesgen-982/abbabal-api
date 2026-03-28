import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  async generateRawKey(): Promise<string> {
    return randomBytes(32).toString('hex');
  }

  async hashKey(key: string): Promise<string> {
    return createHash('sha256').update(key).digest('hex');
  }

  async create(userId: number, name: string): Promise<{ id: number; name: string; key: string; createdAt: Date }> {
    const rawKey = await this.generateRawKey();
    const hashedKey = await this.hashKey(rawKey);

    const apiKey = await this.prisma.apiKey.create({
      data: {
        name,
        key: hashedKey,
        userId,
      },
    });

    return {
      id: apiKey.id,
      name: apiKey.name,
      key: rawKey,
      createdAt: apiKey.createdAt,
    };
  }

  async findAllForUser(userId: number) {
    return this.prisma.apiKey.findMany({
      where: { userId },
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
  }

  async revoke(userId: number, id: number) {
    const existing = await this.prisma.apiKey.findUnique({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('API key not found');
    }

    return this.prisma.apiKey.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });
  }

  async validateKey(key: string) {
    const hashedKey = await this.hashKey(key);

    const apiKey = await this.prisma.apiKey.findUnique({
      where: { key: hashedKey },
      include: { user: true },
    });

    if (!apiKey || !apiKey.isActive) {
      return null;
    }

    await this.prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return apiKey;
  }
}
