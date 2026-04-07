import { Injectable } from '@nestjs/common';
import { db } from './db';
import type { Db } from './db';

@Injectable()
export class DrizzleService {
  readonly db: Db = db;
}
