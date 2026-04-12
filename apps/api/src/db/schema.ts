import {
  check,
  pgTable,
  pgEnum,
  serial,
  integer,
  text,
  real,
  boolean,
  timestamp,
  varchar,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { Role } from '../common/enums/role.enum';
import { relations, sql } from 'drizzle-orm';

export const interpretationTypeEnum = pgEnum('interpretation_type', [
  'translation',
  'meaning',
]);

export const interpretationSourceEnum = pgEnum('interpretation_source', [
  'telegram',
  'ai',
  'user',
]);

export const interpretationLanguageEnum = pgEnum('interpretation_language', ['en', 'am']);

export const proverbs = pgTable('Proverb', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  telegramMessageId: text('telegramMessageId').notNull().unique(),
  telegramChannelId: text('telegramChannelId').notNull(),
  date: timestamp('date', { mode: 'date' }).notNull(),
  scrapedAt: timestamp('scrapedAt', { mode: 'date' }).notNull().defaultNow(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
}, (t) => [index('proverb_text_idx').on(t.text)]);

export const interpretations = pgTable('Interpretation', {
  id: serial('id').primaryKey(),
  proverbId: integer('proverbId')
    .notNull()
    .references(() => proverbs.id, { onDelete: 'cascade' }),
  type: interpretationTypeEnum('type').notNull(),
  language: interpretationLanguageEnum('language').notNull(),
  content: text('content').notNull(),
  source: interpretationSourceEnum('source').notNull(),
  model: text('model'),
  confidence: real('confidence').default(0),
  isApproved: boolean('isApproved').notNull().default(false),
  needsReview: boolean('needsReview').notNull().default(true),
  createdBy: integer('createdBy').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }),
}, (t) => [index('interpretation_proverb_idx').on(t.proverbId)]);

export const proverbStats = pgTable('ProverbStats', {
  id: serial('id').primaryKey(),
  proverbId: integer('proverbId')
    .notNull()
    .references(() => proverbs.id, { onDelete: 'cascade' }),
  views: integer('views').notNull().default(0),
  forwards: integer('forwards').notNull().default(0),
  capturedAt: timestamp('capturedAt', { mode: 'date' }).notNull().defaultNow(),
}, (t) => [index('proverb_stats_idx').on(t.proverbId)]);

export const users = pgTable('User', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: varchar('role', { length: 50 }).notNull().default(Role.USER),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
});

export const apiKeys = pgTable('ApiKey', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  key: text('key').notNull().unique(),
  isActive: boolean('isActive').notNull().default(true),
  lastUsedAt: timestamp('lastUsedAt', { mode: 'date' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
});

export const votes = pgTable('Vote', {
  id: serial('id').primaryKey(),
  userId: integer('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  interpretationId: integer('interpretationId')
    .notNull()
    .references(() => interpretations.id, { onDelete: 'cascade' }),
  value: integer('value').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('vote_unique_idx').on(t.userId, t.interpretationId),
  check('vote_value_check', sql`${t.value} in (-1, 1)`),
]);

export type Proverb = typeof proverbs.$inferSelect;
export type Interpretation = typeof interpretations.$inferSelect;
export type ProverbStat = typeof proverbStats.$inferSelect;
export type User = typeof users.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type Vote = typeof votes.$inferSelect;

export const usersRelations = relations(users, ({ many }) => ({
  apiKeys: many(apiKeys),
  interpretations: many(interpretations),
  votes: many(votes),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, { fields: [apiKeys.userId], references: [users.id] }),
}));

export const proverbsRelations = relations(proverbs, ({ many }) => ({
  interpretations: many(interpretations),
  stats: many(proverbStats),
}));

export const interpretationsRelations = relations(interpretations, ({ one, many }) => ({
  proverb: one(proverbs, {
    fields: [interpretations.proverbId],
    references: [proverbs.id],
  }),
  creator: one(users, {
    fields: [interpretations.createdBy],
    references: [users.id],
  }),
  votes: many(votes),
}));

export const proverbStatsRelations = relations(proverbStats, ({ one }) => ({
  proverb: one(proverbs, {
    fields: [proverbStats.proverbId],
    references: [proverbs.id],
  }),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
  interpretation: one(interpretations, {
    fields: [votes.interpretationId],
    references: [interpretations.id],
  }),
}));
