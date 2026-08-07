import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { createReadStream, statSync } from 'node:fs';
import { AppService } from './app.service';
import { getDbPath } from './db';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('stats')
  getStats() {
    return this.appService.getStats();
  }

  @Get('download')
  download(@Res() res: Response) {
    this.streamDb(res);
  }

  @Get('proverbs.db')
  downloadDb(@Res() res: Response) {
    this.streamDb(res);
  }

  private streamDb(@Res() res: Response) {
    const dbPath = getDbPath();
    const stats = statSync(dbPath);
    res.setHeader('Content-Type', 'application/vnd.sqlite3');
    res.setHeader('Content-Disposition', 'attachment; filename="proverbs.db"');
    res.setHeader('Content-Length', stats.size);
    createReadStream(dbPath).pipe(res);
  }
}
