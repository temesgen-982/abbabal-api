import { resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export function getDbPath() {
  return resolve(__dirname, '../../../../data/proverbs.db');
}

const dbPath = getDbPath();

const sqlite = new DatabaseSync(dbPath);
sqlite.exec('PRAGMA journal_mode = WAL');
sqlite.exec('PRAGMA foreign_keys = ON');

export function getDb() {
  return sqlite;
}

export function closeDb() {
  sqlite.close();
}
