import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle.service';
import { proverbs } from '../db/schema';
import { eq, or, like, sql, count } from 'drizzle-orm';

@Injectable()
export class ProverbsService {
  constructor(private drizzle: DrizzleService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const db = this.drizzle.db;

    const [data, [{ total }]] = await Promise.all([
      db.select().from(proverbs).orderBy(sql`${proverbs.id} desc`).limit(limit).offset(skip),
      db.select({ total: count() }).from(proverbs),
    ]);

    return { page, limit, total, results: data };
  }

  findOne(id: number) {
    return this.drizzle.db.query.proverbs.findFirst({ where: eq(proverbs.id, id) });
  }

  async random() {
    const [{ total }] = await this.drizzle.db.select({ total: count() }).from(proverbs);
    const offset = Math.floor(Math.random() * total);
    const [result] = await this.drizzle.db.select().from(proverbs).limit(1).offset(offset);
    return result;
  }

  search(query: string, limit = 20) {
    if (!query?.trim()) return [];
    return this.drizzle.db
      .select()
      .from(proverbs)
      .where(or(like(proverbs.text, `%${query}%`), like(proverbs.englishTranslation, `%${query}%`)))
      .orderBy(sql`${proverbs.id} desc`)
      .limit(limit);
  }

  async create(data: any) {
    const [result] = await this.drizzle.db
      .insert(proverbs)
      .values({
        ...data,
        date: new Date(), // Set current date
        views: 0,
        forwards: 0,
      })
      .returning();
    return result;
  }

  async update(id: number, data: any) {
    const [result] = await this.drizzle.db
      .update(proverbs)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(proverbs.id, id))
      .returning();
    return result;
  }

  async remove(id: number) {
    const [result] = await this.drizzle.db
      .delete(proverbs)
      .where(eq(proverbs.id, id))
      .returning();
    return result;
  }
}
