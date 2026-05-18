import { Module } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { ApiKeysController } from './api-keys.controller';
import { DrizzleService } from 'src/drizzle.service';
import { ApiKeyGuard } from './guards/api-key.guard';
import { OptionalApiKeyGuard } from './guards/optional-api-key.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';

@Module({
  providers: [ApiKeysService, DrizzleService, ApiKeyGuard, OptionalApiKeyGuard, RateLimitGuard],
  controllers: [ApiKeysController],
  exports: [ApiKeysService, ApiKeyGuard, OptionalApiKeyGuard, RateLimitGuard],
})
export class ApiKeysModule {}
