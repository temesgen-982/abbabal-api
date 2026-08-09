import 'dotenv/config';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { TelegramClient } from 'teleproto';
import { StringSession } from 'teleproto/sessions';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = resolve(__dirname, '../data/proverbs.db');

const API_ID = Number(process.env.TG_API_ID);
const API_HASH = process.env.TG_API_HASH ?? '';
const SESSION_STRING = process.env.TG_SESSION ?? '';
const CHANNEL_USERNAME = 'ababaloch';

function cleanMessage(text) {
  if (!text) return '';
  return text.replace(/#\w+/g, '').replace(/\n{3,}/g, '\n\n').trim();
}

function getLastFetchedId(db) {
  const row = db.prepare("SELECT value FROM meta WHERE key = 'last_message_id'").get();
  return Number(row?.value) || 0;
}

async function fetchUpdates() {
  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode = WAL');

  // Track the highest message id already seen separately from the proverbs PK,
  // since a reposted proverb updates its row (id unchanged) rather than inserting.
  db.exec('CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT)');

  // Ensure the proverbs table and the unique index that ON CONFLICT(text) relies
  // on exist. On a fresh DB neither is present yet, and the upsert below would
  // otherwise fail with "ON CONFLICT clause does not match any PRIMARY KEY or
  // UNIQUE constraint". Idempotent when they already exist.
  db.exec(`
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

    CREATE UNIQUE INDEX IF NOT EXISTS idx_proverbs_text ON proverbs(text);
  `);

  const session = new StringSession(SESSION_STRING);
  const client = new TelegramClient(session, API_ID, API_HASH, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => process.env.TG_PHONE ?? '',
    password: async () => process.env.TG_PASSWORD ?? '',
    phoneCode: async () => process.env.TG_CODE ?? '',
    onError: console.error,
  });

  const channel = await client.getEntity(CHANNEL_USERNAME);
  const lastId = getLastFetchedId(db);
  console.log(`Fetching updates since message ID: ${lastId}`);

  const upsert = db.prepare(`
    INSERT INTO proverbs (id, text, date, views, forwards, source, scraped_at, created_at)
    VALUES (?, ?, ?, ?, ?, 'telegram', ?, ?)
    ON CONFLICT(text) DO UPDATE SET
      views = excluded.views,
      forwards = excluded.forwards,
      date = excluded.date,
      updated_at = excluded.created_at
  `);

  let count = 0;
  let maxMessageId = lastId;
  const batch = [];
  for await (const message of client.iterMessages(channel, { minId: lastId, reverse: true })) {
    if (!message.message) continue;
    if (message.id > maxMessageId) maxMessageId = message.id;

    batch.push({
      id: message.id,
      date: String(message.date),
      text: cleanMessage(message.message),
      views: message.views ?? 0,
      forwards: message.forwards ?? 0,
    });

    if (batch.length >= 100) {
      const items = batch.splice(0);
      const now = new Date().toISOString();
      db.exec('BEGIN');
      for (const e of items) {
        upsert.run(e.id, e.text, e.date, e.views, e.forwards, e.date, now);
        count++;
      }
      db.exec('COMMIT');
      console.log(`Saved ${count} proverbs...`);
    }
  }

  if (batch.length > 0) {
    const now = new Date().toISOString();
    for (const e of batch) {
      upsert.run(e.id, e.text, e.date, e.views, e.forwards, e.date, now);
      count++;
    }
  }

  db.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)').run('last_message_id', String(maxMessageId));

  console.log(`Done. ${count} messages processed.`);
  db.close();
  await client.disconnect();
}

fetchUpdates().catch((e) => { console.error('Fetch failed:', e); process.exit(1); });
