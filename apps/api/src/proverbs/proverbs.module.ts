import { Module } from '@nestjs/common';
import { ProverbsService } from './proverbs.service';
import { ProverbsController } from './proverbs.controller';
import { DrizzleService } from '../drizzle.service';

@Module({
  providers: [ProverbsService, DrizzleService],
  controllers: [ProverbsController],
})
export class ProverbsModule {}
