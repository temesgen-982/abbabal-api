import { applyDecorators, UseGuards } from '@nestjs/common';
import { OptionalApiKeyGuard } from 'src/api-keys/guards/optional-api-key.guard';
import { RateLimitGuard } from 'src/api-keys/guards/rate-limit.guard';

export function OptionalApiAuth() {
  return applyDecorators(
    UseGuards(OptionalApiKeyGuard, RateLimitGuard),
  );
}