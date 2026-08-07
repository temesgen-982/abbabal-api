import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import type { Interpretation, PaginatedProverbs, Proverb } from './api';

const DB_NAME = 'proverbs';
const LAST_SYNC_KEY = 'abbabal.lastSyncAt';

export const SYNC_URL = '/proverbs.db';

type ProverbRow = {
  id: number;
  text: string;
  date: string;
  views: number | null;
  forwards: number | null;
  source: string | null;
  scrapedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type InterpretationRow = {
  id: number;
  proverbId: number;
  type: 'translation' | 'meaning';
  language: 'en' | 'am';
  content: string;
  model: string | null;
  confidence: number | null;
  needsReview: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

const PROVERB_COLUMNS =
  'id, text, date, views, forwards, source, scraped_at as scrapedAt, created_at as createdAt, updated_at as updatedAt';

const INTERPRETATION_COLUMNS =
  'id, proverb_id as proverbId, type, language, content, model, confidence, needs_review as needsReview, created_at as createdAt, updated_at as updatedAt';

let sqlite: SQLiteConnection | null = null;
let conn: SQLiteDBConnection | null = null;
let ready: Promise<SQLiteDBConnection | null> | null = null;

function getSqlite() {
  if (!sqlite) sqlite = new SQLiteConnection(CapacitorSQLite);
  return sqlite;
}

export function isNativePlatform() {
  return Capacitor.isNativePlatform();
}

function mapInterpretation(row: InterpretationRow): Interpretation {
  return {
    id: row.id,
    proverbId: row.proverbId,
    type: row.type,
    language: row.language,
    content: row.content,
    source: row.model ? 'ai' : 'telegram',
    confidence: row.confidence ?? null,
    isApproved: row.needsReview === 0,
    createdAt: row.createdAt ?? '',
  };
}

function mapProverb(row: ProverbRow, interpretations: Interpretation[] = []): Proverb {
  return {
    id: row.id,
    text: row.text,
    date: row.date,
    createdAt: row.createdAt ?? '',
    interpretations,
  };
}

function getConnection(): Promise<SQLiteDBConnection | null> {
  if (!isNativePlatform()) return Promise.resolve(null);
  if (conn) return Promise.resolve(conn);
  if (!ready) {
    ready = (async () => {
      try {
        const connection = getSqlite();
        const { result: exists } = await CapacitorSQLite.isDatabase({ database: DB_NAME });
        if (!exists) {
          await CapacitorSQLite.copyFromAssets({ overwrite: false });
        }
        conn = await connection.createConnection(DB_NAME, false, 'no-encryption', 1, false);
        await conn.open();
        return conn;
      } catch (e) {
        console.error('[db] init failed', e);
        ready = null;
        conn = null;
        return null;
      }
    })();
  }
  return ready;
}

async function query<T>(statement: string, values: unknown[] = []): Promise<T[]> {
  const connection = await getConnection();
  if (!connection) throw new Error('Local database unavailable');
  const res = await connection.query(statement, values);
  return (res.values ?? []) as T[];
}

async function interpretationsFor(proverbIds: number[]): Promise<Map<number, Interpretation[]>> {
  if (proverbIds.length === 0) return new Map();
  const placeholders = proverbIds.map(() => '?').join(',');
  const rows = await query<InterpretationRow>(
    `SELECT ${INTERPRETATION_COLUMNS} FROM interpretations WHERE proverb_id IN (${placeholders}) ORDER BY id`,
    proverbIds,
  );
  const map = new Map<number, Interpretation[]>();
  for (const row of rows) {
    const list = map.get(row.proverbId) ?? [];
    list.push(mapInterpretation(row));
    map.set(row.proverbId, list);
  }
  return map;
}

export const localDb = {
  async isReady(): Promise<boolean> {
    return (await getConnection()) !== null;
  },

  async list(page = 1, limit = 20): Promise<PaginatedProverbs> {
    const skip = (page - 1) * limit;
    const rows = await query<ProverbRow>(
      `SELECT ${PROVERB_COLUMNS} FROM proverbs ORDER BY id DESC LIMIT ? OFFSET ?`,
      [limit, skip],
    );
    const [totalRow] = await query<{ total: number }>('SELECT COUNT(*) as total FROM proverbs');
    const total = Number(totalRow?.total ?? 0);
    const interps = await interpretationsFor(rows.map((r) => r.id));
    return {
      page,
      limit,
      total,
      results: rows.map((r) => mapProverb(r, interps.get(r.id) ?? [])),
    };
  },

  async findOne(id: number): Promise<Proverb | null> {
    const [row] = await query<ProverbRow>(
      `SELECT ${PROVERB_COLUMNS} FROM proverbs WHERE id = ?`,
      [id],
    );
    if (!row) return null;
    const interps = await interpretationsFor([id]);
    return mapProverb(row, interps.get(id) ?? []);
  },

  async random(): Promise<Proverb | null> {
    const [row] = await query<ProverbRow>(
      `SELECT ${PROVERB_COLUMNS} FROM proverbs ORDER BY RANDOM() LIMIT 1`,
    );
    if (!row) return null;
    const interps = await interpretationsFor([row.id]);
    return mapProverb(row, interps.get(row.id) ?? []);
  },

  async search(q: string, limit = 20): Promise<Proverb[]> {
    if (!q.trim()) return [];
    const like = `%${q}%`;
    const rows = await query<ProverbRow>(
      `SELECT DISTINCT p.id, p.text, p.date, p.views, p.forwards, p.source, p.scraped_at as scrapedAt, p.created_at as createdAt, p.updated_at as updatedAt
       FROM proverbs p
       LEFT JOIN interpretations i ON i.proverb_id = p.id
       WHERE p.text LIKE ? OR i.content LIKE ?
       ORDER BY p.id DESC
       LIMIT ?`,
      [like, like, limit],
    );
    const interps = await interpretationsFor(rows.map((r) => r.id));
    return rows.map((r) => mapProverb(r, interps.get(r.id) ?? []));
  },
};

export async function syncDatabase(baseUrl: string): Promise<boolean> {
  if (!isNativePlatform()) return false;
  try {
    if (conn) {
      await conn.close();
      await getSqlite().closeConnection(DB_NAME, false);
      conn = null;
    }
    ready = null;

    const url = `${baseUrl}${SYNC_URL}`;
    await CapacitorSQLite.getFromHTTPRequest({ url, overwrite: true });

    await getConnection();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    }
    return true;
  } catch (e) {
    console.error('[db] sync failed', e);
    ready = null;
    conn = null;
    return false;
  }
}

export function getLastSyncAt(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(LAST_SYNC_KEY);
}
