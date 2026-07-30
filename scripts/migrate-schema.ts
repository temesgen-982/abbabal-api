import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = dirname(fileURLToPath(import.meta.url));

const OLD_DB_PATH = resolve(__dirname, '../scraper-dump/data/proverbs.db');
const NEW_DB_PATH = resolve(__dirname, '../data/proverbs.db');

const oldDb = new DatabaseSync(OLD_DB_PATH);
const newDb = new DatabaseSync(NEW_DB_PATH);
newDb.exec('PRAGMA journal_mode = WAL');
newDb.exec('PRAGMA foreign_keys = ON');

console.log('Creating tables...');
newDb.exec(`
  CREATE TABLE IF NOT EXISTS proverbs (
    id INTEGER PRIMARY KEY,
    text TEXT NOT NULL,
    date TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    forwards INTEGER DEFAULT 0,
    source TEXT DEFAULT 'telegram' NOT NULL,
    scraped_at TEXT,
    created_at TEXT,
    updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS interpretations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proverb_id INTEGER NOT NULL REFERENCES proverbs(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    language TEXT NOT NULL,
    content TEXT NOT NULL,
    model TEXT,
    confidence REAL DEFAULT 0,
    needs_review INTEGER DEFAULT 0,
    created_at TEXT,
    updated_at TEXT
  );
`);

const rows = oldDb.prepare('SELECT * FROM proverbs ORDER BY id ASC').all();
console.log(`Found ${rows.length} proverbs to migrate`);

const insertProverb = newDb.prepare(`
  INSERT OR IGNORE INTO proverbs (id, text, date, views, forwards, source, scraped_at, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, 'telegram', ?, ?, ?)
`);

const insertInterpretation = newDb.prepare(`
  INSERT INTO interpretations (proverb_id, type, language, content, model, confidence, needs_review, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let proverbCount = 0;
let interpCount = 0;
const now = new Date().toISOString();

newDb.exec('BEGIN');
for (const r of rows) {
  insertProverb.run(r.id, r.text, r.date, r.views || 0, r.forwards || 0, r.date, now, null);
  proverbCount++;

  if (r.english_translation && String(r.english_translation).trim()) {
    insertInterpretation.run(r.id, 'translation', 'en', String(r.english_translation).trim(), r.translation_source || null, r.confidence || 0, r.needs_review ? 1 : 0, now, null);
    interpCount++;
  }
  if (r.amharic_meaning && String(r.amharic_meaning).trim()) {
    insertInterpretation.run(r.id, 'meaning', 'am', String(r.amharic_meaning).trim(), r.meaning_source || null, r.confidence || 0, r.needs_review ? 1 : 0, now, null);
    interpCount++;
  }
  if (r.english_meaning && String(r.english_meaning).trim()) {
    insertInterpretation.run(r.id, 'meaning', 'en', String(r.english_meaning).trim(), r.meaning_source || null, r.confidence || 0, r.needs_review ? 1 : 0, now, null);
    interpCount++;
  }
}
newDb.exec('COMMIT');
console.log(`Migrated ${proverbCount} proverbs and ${interpCount} interpretations`);

oldDb.close();
newDb.close();
