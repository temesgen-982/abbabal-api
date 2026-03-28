import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { createHash } from 'crypto';

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const apiKeyId = req.apiKey?.id;

    if (typeof apiKeyId === 'number') {
      return `api-key:${apiKeyId}`;
    }

    const rawKey = req.headers['x-api-key'];

    if (typeof rawKey === 'string' && rawKey.length > 0) {
      return `api-key:${rawKey}`;
    }

    return super.getTracker(req);
  }

  protected generateKey(
    context: ExecutionContext,
    suffix: string,
    name: string,
  ): string {
    const controllerName = context.getClass().name;

    return createHash('sha256')
      .update(`${controllerName}-${name}-${suffix}`)
      .digest('hex');
  }
}
