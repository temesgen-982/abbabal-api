import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ApiKeysService } from '../api-keys.service'

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private readonly apiKeysService: ApiKeysService){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();

        const rawKey = request.headers['x-api-key'];

        if (!rawKey || typeof rawKey !== 'string'){
            throw new UnauthorizedException('Missing API key');
        }

        const apiKey = await this.apiKeysService.validateKey(rawKey);

        if(!apiKey){
            throw new UnauthorizedException('Invalid or inactive API key');
        }

        request.apiKey = {
            id: apiKey.id,
            name: apiKey.name,
            userId: apiKey.userId
        };

        request.user = {
            id: apiKey.user.id,
            username: apiKey.user.username,
            role: apiKey.user.role,
        };

        return true;
    }
}