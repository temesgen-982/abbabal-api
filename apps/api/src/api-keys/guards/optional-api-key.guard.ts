import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ApiKeysService } from '../api-keys.service';

@Injectable()
export class OptionalApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<true> {
    const request = context.switchToHttp().getRequest();
    const rawKey = request.headers['x-api-key'];

    if (rawKey && typeof rawKey === 'string') {
      const apiKey = await this.apiKeysService.validateKey(rawKey);
      if (apiKey) {
        request.apiKey = {
          id: apiKey.id,
          name: apiKey.name,
          userId: apiKey.userId,
        };
        request.user = {
          id: apiKey.user.id,
          email: apiKey.user.email,
          role: apiKey.user.role,
        };
      }
    }

    return true; // always allow api key is optional
  }
}
