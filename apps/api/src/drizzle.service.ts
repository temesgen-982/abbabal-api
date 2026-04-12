import {
  BeforeApplicationShutdown,
  Injectable,
  OnModuleDestroy,
} from '@nestjs/common';
import { db, pool } from './db';
import type { Db } from './db';

@Injectable()
export class DrizzleService
  implements OnModuleDestroy, BeforeApplicationShutdown
{
  readonly db: Db = db;

  private isPoolClosed = false;

  private async closePool() {
    if (this.isPoolClosed) return;
    this.isPoolClosed = true;
    await pool.end();
  }

  async onModuleDestroy() {
    await this.closePool();
  }

  async beforeApplicationShutdown() {
    await this.closePool();
  }
}
