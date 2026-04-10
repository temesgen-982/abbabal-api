import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { Roles } from './roles.decorator';
import { ApiKeyGuard } from 'src/api-keys/guards/api-key.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiSecurity } from '@nestjs/swagger';
import { RateLimitGuard } from 'src/api-keys/guards/rate-limit.guard';

export function ApiAuth(...roles: Role[]) {
  return applyDecorators(
    Roles(roles),
    UseGuards(ApiKeyGuard, RolesGuard, RateLimitGuard),
    ApiSecurity('apiKey'), // Swagger
  );
}
