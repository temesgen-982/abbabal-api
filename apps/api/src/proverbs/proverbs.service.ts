import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle.service';
import { interpretations, proverbStats, proverbs } from '../db/schema';
import { count, desc, eq, inArray, like, or, sql } from 'drizzle-orm';
import { CreateProverbDto, ProverbSource } from './dto/create-proverb.dto';
import { UpdateProverbDto } from './dto/update-proverb.dto';
import { ReviewProverbStatus } from './dto/review-proverb.dto';

@Injectable()
export class ProverbsService {
  constructor(private drizzle: DrizzleService) {}

  private async hydrateProverbs(baseProverbs: Array<typeof proverbs.$inferSelect>) {
    if (baseProverbs.length === 0) return [];

    const proverbIds = baseProverbs.map((proverb) => proverb.id);

    const [allInterpretations, latestStatsRows] = await Promise.all([
      this.drizzle.db
        .select()
        .from(interpretations)
        .where(inArray(interpretations.proverbId, proverbIds))
        .orderBy(desc(interpretations.createdAt)),
      this.drizzle.db
        .select()
        .from(proverbStats)
        .where(inArray(proverbStats.proverbId, proverbIds))
        .orderBy(desc(proverbStats.capturedAt)),
    ]);

    const interpretationsByProverb = new Map<number, Array<typeof interpretations.$inferSelect>>();
    for (const interpretation of allInterpretations) {
      const existing = interpretationsByProverb.get(interpretation.proverbId) ?? [];
      existing.push(interpretation);
      interpretationsByProverb.set(interpretation.proverbId, existing);
    }

    const latestStatsByProverb = new Map<number, typeof proverbStats.$inferSelect>();
    for (const statsRow of latestStatsRows) {
      if (!latestStatsByProverb.has(statsRow.proverbId)) {
        latestStatsByProverb.set(statsRow.proverbId, statsRow);
      }
    }

    return baseProverbs.map((proverb) => ({
      ...proverb,
      interpretations: interpretationsByProverb.get(proverb.id) ?? [],
      latestStats: latestStatsByProverb.get(proverb.id) ?? null,
    }));
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const db = this.drizzle.db;

    const [baseData, [{ total }]] = await Promise.all([
      db.select().from(proverbs).orderBy(sql`${proverbs.id} desc`).limit(limit).offset(skip),
      db.select({ total: count() }).from(proverbs),
    ]);

    const data = await this.hydrateProverbs(baseData);

    return { page, limit, total, results: data };
  }

  async findOne(id: number) {
    const proverb = await this.drizzle.db.query.proverbs.findFirst({ where: eq(proverbs.id, id) });
    if (!proverb) return null;
    const [hydrated] = await this.hydrateProverbs([proverb]);
    return hydrated ?? null;
  }

  async random() {
    const [{ total }] = await this.drizzle.db.select({ total: count() }).from(proverbs);
    if (total === 0) return null;
    const offset = Math.floor(Math.random() * total);
    const [result] = await this.drizzle.db.select().from(proverbs).limit(1).offset(offset);
    if (!result) return null;
    const [hydrated] = await this.hydrateProverbs([result]);
    return hydrated ?? null;
  }

  async search(query: string, limit = 20) {
    if (!query?.trim()) return [];

    const q = `%${query}%`;

    const baseProverbs = await this.drizzle.db
      .select()
      .from(proverbs)
      .where(
        or(
          like(proverbs.text, q),
          sql`exists (
            select 1
            from "Interpretation" i
            where i."proverbId" = ${proverbs.id}
              and i."type" = 'translation'
              and i."content" ilike ${q}
          )`,
        ),
      )
      .orderBy(sql`${proverbs.id} desc`)
      .limit(limit);

    return this.hydrateProverbs(baseProverbs);
  }

  async create(data: CreateProverbDto & { createdBy?: number | null }) {
    const isTelegramSource = data.source === ProverbSource.TELEGRAM;

    const [result] = await this.drizzle.db
      .insert(proverbs)
      .values({
        ...data,
        telegramMessageId: isTelegramSource ? data.telegramMessageId ?? null : null,
        date: data.date ? new Date(data.date) : new Date(),
        scrapedAt: data.scrapedAt ? new Date(data.scrapedAt) : new Date(),
      })
      .returning();

    const [hydrated] = await this.hydrateProverbs([result]);
    return hydrated;
  }

  async update(id: number, data: UpdateProverbDto) {
    const isTelegramSource = data.source === ProverbSource.TELEGRAM;

    const [result] = await this.drizzle.db
      .update(proverbs)
      .set({
        ...data,
        telegramMessageId: data.source
          ? isTelegramSource
            ? data.telegramMessageId
            : null
          : data.telegramMessageId,
        date: data.date ? new Date(data.date) : undefined,
        scrapedAt: data.scrapedAt ? new Date(data.scrapedAt) : undefined,
      })
      .where(eq(proverbs.id, id))
      .returning();

    if (!result) return null;
    const [hydrated] = await this.hydrateProverbs([result]);
    return hydrated;
  }

  async review(id: number, status: ReviewProverbStatus) {
    const [result] = await this.drizzle.db
      .update(proverbs)
      .set({ status })
      .where(eq(proverbs.id, id))
      .returning();

    if (!result) return null;
    const [hydrated] = await this.hydrateProverbs([result]);
    return hydrated;
  }

  async remove(id: number) {
    const [result] = await this.drizzle.db
      .delete(proverbs)
      .where(eq(proverbs.id, id))
      .returning();
    return result;
  }
}
