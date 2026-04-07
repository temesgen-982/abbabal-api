import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle.service';
import { apiKeys, users } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private drizzle: DrizzleService) {}

  generateRawKey(): string {
    return randomBytes(32).toString('hex');
  }

  hashKey(key: string): string {
    return createHash('sha256').update(key).digest('hex');
  }

  async create(userId: number, name: string) {
    const rawKey = this.generateRawKey();
    const hashedKey = this.hashKey(rawKey);

    const [apiKey] = await this.drizzle.db
      .insert(apiKeys)
      .values({ name, key: hashedKey, userId })
      .returning({ id: apiKeys.id, name: apiKeys.name, createdAt: apiKeys.createdAt });

    return { ...apiKey, key: rawKey };
  }

  findAllForUser(userId: number) {
    return this.drizzle.db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        isActive: apiKeys.isActive,
        lastUsedAt: apiKeys.lastUsedAt,
        createdAt: apiKeys.createdAt,
        updatedAt: apiKeys.updatedAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId))
      .orderBy(apiKeys.createdAt);
  }

  async revoke(userId: number, id: number) {
    const existing = await this.drizzle.db.query.apiKeys.findFirst({
      where: and(eq(apiKeys.id, id), eq(apiKeys.userId, userId)),
    });

    if (!existing) throw new NotFoundException('API key not found');

    const [updated] = await this.drizzle.db
      .update(apiKeys)
      .set({ isActive: false })
      .where(eq(apiKeys.id, id))
      .returning({ id: apiKeys.id, name: apiKeys.name, isActive: apiKeys.isActive });

    return updated;
  }

  async validateKey(key: string) {
    const hashedKey = this.hashKey(key);

    const result = await this.drizzle.db.query.apiKeys.findFirst({
      where: eq(apiKeys.key, hashedKey),
      with: { user: true },
    });

    if (!result || !result.isActive) return null;

    await this.drizzle.db
      .update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKeys.id, result.id));

    return result;
  }
}
