import {
  pgTable,
  serial,
  integer,
  text,
  real,
  boolean,
  timestamp,
  varchar,
  index,
} from 'drizzle-orm/pg-core';
import { Role } from '../common/enums/role.enum';

export const proverbs = pgTable('Proverb', {
  id: serial('id').primaryKey(),
  date: timestamp('date', { mode: 'date' }).notNull(),
  text: text('text').notNull(),
  views: integer('views').notNull(),
  forwards: integer('forwards').notNull(),
  englishTranslation: text('englishTranslation'),
  amharicMeaning: text('amharicMeaning'),
  englishMeaning: text('englishMeaning'),
  translationSource: text('translationSource'),
  meaningSource: text('meaningSource'),
  confidence: real('confidence').notNull().default(0),
  needsReview: boolean('needsReview').notNull().default(false),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }),
}, (t) => [index('Proverb_text_idx').on(t.text)]);

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
