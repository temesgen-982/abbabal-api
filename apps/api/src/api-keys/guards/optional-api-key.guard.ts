import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ApiKeysService } from '../api-keys.service';

type OptionalAuthRequest = {
  headers: Record<string, string | string[] | undefined>;
  apiKey?: {
    id: number;
    name: string;
    userId: number;
  };
  user?: {
    id: number;
    email: string;
    role: string;
  };
};

@Injectable()
export class OptionalApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<true> {
    const request = context.switchToHttp().getRequest<OptionalAuthRequest>();
    const rawKey = request.headers['x-api-key'];

    if (typeof rawKey !== 'string' || rawKey.length === 0) {
      return true;
    }

    const apiKey = await this.apiKeysService.validateKey(rawKey);

    if (!apiKey) {
      delete request.headers['x-api-key'];
      return true;
    }

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

    return true; // always allow api key is optional
  }
}
