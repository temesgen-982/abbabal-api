import '../load-env';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || databaseUrl.trim() === '') {
  throw new Error('DATABASE_URL must be set in .env');
}

const isTestEnv = process.env.NODE_ENV === 'test' || !!process.env.JEST_WORKER_ID;

export const pool = new Pool({
  connectionString: databaseUrl,
  allowExitOnIdle: isTestEnv,
});

export const db = drizzle(pool, { schema });
export type Db = typeof db;
