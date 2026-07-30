import { Injectable } from '@nestjs/common';
import { getDb, getDbPath } from './db';
import { statSync } from 'node:fs';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'UP',
      service: 'abbabal-api',
      timestamp: new Date().toISOString(),
    };
  }

  getStats() {
    const db = getDb();
    const [proverbRow] = db.prepare('SELECT COUNT(*) as c FROM proverbs').all();
    const [interpRow] = db.prepare('SELECT COUNT(*) as c FROM interpretations').all();

    const fileStat = statSync(getDbPath());

    return {
      proverbs: Number(proverbRow.c),
      interpretations: Number(interpRow.c),
      dbSize: fileStat.size,
      dbUpdatedAt: fileStat.mtime.toISOString(),
    };
  }
}
