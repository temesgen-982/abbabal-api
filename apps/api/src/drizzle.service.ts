import { Injectable } from '@nestjs/common';
import { getDb, closeDb } from './db';

@Injectable()
export class DrizzleService {
  readonly db = getDb();

  async onModuleDestroy() {
    closeDb();
  }
}
