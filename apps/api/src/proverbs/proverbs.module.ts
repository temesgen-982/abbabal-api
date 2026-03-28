import { Module } from '@nestjs/common';
import { ProverbsService } from './proverbs.service';
import { ProverbsController } from './proverbs.controller';
import { PrismaService } from '../prisma.service';
import { ApiKeysModule } from 'src/api-keys/api-keys.module';
@Module({
  imports: [ApiKeysModule],
  providers: [ProverbsService, PrismaService],
  controllers: [ProverbsController]
})
export class ProverbsModule {}
