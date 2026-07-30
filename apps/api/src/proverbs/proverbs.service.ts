import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle.service';

@Injectable()
export class ProverbsService {
  constructor(private drizzle: DrizzleService) {}

  findAll(page = 1, limit = 20) {
    const db = this.drizzle.db;
    const skip = (page - 1) * limit;

    const rows = db.prepare(
      'SELECT id, text, date, views, forwards, source, scraped_at as scrapedAt, created_at as createdAt, updated_at as updatedAt FROM proverbs ORDER BY id DESC LIMIT ? OFFSET ?',
    ).all(limit, skip);

    const [{ total }] = db.prepare('SELECT COUNT(*) as total FROM proverbs').all();

    return { page, limit, total: Number(total), results: rows };
  }

  findOne(id: number) {
    const db = this.drizzle.db;
    const row = db.prepare(
      'SELECT id, text, date, views, forwards, source, scraped_at as scrapedAt, created_at as createdAt, updated_at as updatedAt FROM proverbs WHERE id = ?',
    ).get(id);

    if (!row) return null;

    const interps = db.prepare(
      'SELECT id, proverb_id as proverbId, type, language, content, model, confidence, needs_review as needsReview, created_at as createdAt, updated_at as updatedAt FROM interpretations WHERE proverb_id = ?',
    ).all(id);

    return { ...row, interpretations: interps };
  }

  random() {
    const db = this.drizzle.db;
    const [{ total }] = db.prepare('SELECT COUNT(*) as total FROM proverbs').all();
    const totalCount = Number(total);
    if (totalCount === 0) return null;

    const offset = Math.floor(Math.random() * totalCount);
    const row = db.prepare(
      'SELECT id, text, date, views, forwards, source, scraped_at as scrapedAt, created_at as createdAt, updated_at as updatedAt FROM proverbs LIMIT 1 OFFSET ?',
    ).get(offset);

    if (!row) return null;

    const interps = db.prepare(
      'SELECT id, proverb_id as proverbId, type, language, content, model, confidence, needs_review as needsReview, created_at as createdAt, updated_at as updatedAt FROM interpretations WHERE proverb_id = ?',
    ).all(row.id);

    return { ...row, interpretations: interps };
  }

  search(query: string, limit = 20) {
    if (!query?.trim()) return [];
    const q = `%${query}%`;

    const db = this.drizzle.db;
    const rows = db.prepare(`
      SELECT DISTINCT p.id, p.text, p.date, p.views, p.forwards, p.source, p.scraped_at as scrapedAt, p.created_at as createdAt, p.updated_at as updatedAt
      FROM proverbs p
      LEFT JOIN interpretations i ON i.proverb_id = p.id
      WHERE p.text LIKE ? OR i.content LIKE ?
      ORDER BY p.id DESC
      LIMIT ?
    `).all(q, q, limit);

    return rows;
  }
}
