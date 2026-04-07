import { Module } from '@nestjs/common';
import { ProverbsService } from './proverbs.service';
import { ProverbsController } from './proverbs.controller';
import { DrizzleService } from '../drizzle.service';
import { ApiKeysModule } from 'src/api-keys/api-keys.module';
@Module({
  imports: [ApiKeysModule],
  providers: [ProverbsService, DrizzleService],
  controllers: [ProverbsController]
})
export class ProverbsModule {}
