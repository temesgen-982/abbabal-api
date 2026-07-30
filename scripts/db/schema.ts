import { sqliteTable, text, integer, real, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const proverbs = sqliteTable('proverbs', {
  id: integer('id').primaryKey(),
  text: text('text').notNull(),
  date: text('date').notNull(),
  views: integer('views').default(0),
  forwards: integer('forwards').default(0),
  source: text('source').default('telegram').notNull(),
  scrapedAt: text('scraped_at'),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
});

export const interpretations = sqliteTable('interpretations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  proverbId: integer('proverb_id').notNull().references(() => proverbs.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  language: text('language').notNull(),
  content: text('content').notNull(),
  model: text('model'),
  confidence: real('confidence').default(0),
  needsReview: integer('needs_review').default(0),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
});
