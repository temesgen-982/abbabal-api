import { sqliteTable, integer, text, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const proverbs = sqliteTable('Proverb', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  text: text('text').notNull(),
  views: integer('views').notNull(),
  forwards: integer('forwards').notNull(),
  englishTranslation: text('englishTranslation'),
  amharicMeaning: text('amharicMeaning'),
  englishMeaning: text('englishMeaning'),
  translationSource: text('translationSource'),
  meaningSource: text('meaningSource'),
  confidence: real('confidence').notNull().default(0),
  needsReview: integer('needsReview', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }),
}, (t) => [index('Proverb_text_idx').on(t.text)]);

export const users = sqliteTable('User', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['ADMIN', 'USER'] }).notNull().default('USER'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const apiKeys = sqliteTable('ApiKey', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  key: text('key').notNull().unique(),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
  lastUsedAt: integer('lastUsedAt', { mode: 'timestamp' }),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
});

export type Proverb = typeof proverbs.$inferSelect;
export type User = typeof users.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;

import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many }) => ({
  apiKeys: many(apiKeys),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, { fields: [apiKeys.userId], references: [users.id] }),
}));
