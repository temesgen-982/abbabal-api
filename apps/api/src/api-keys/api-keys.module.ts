import { Module } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { ApiKeysController } from './api-keys.controller';
import { PrismaService } from 'src/prisma.service';
import { ApiKeyGuard } from './guards/api-key.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';

@Module({
  providers: [ApiKeysService, PrismaService, ApiKeyGuard, RateLimitGuard],
  controllers: [ApiKeysController],
  exports: [ApiKeysService, ApiKeyGuard, RateLimitGuard],
})
export class ApiKeysModule {}
