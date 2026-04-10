import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { Roles } from './roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    Roles(roles),
    // (Auth first, then Roles)
    UseGuards(JwtAuthGuard, RolesGuard),
    
    ApiBearerAuth('bearer'),
    ApiUnauthorizedResponse({ description: 'Unauthorized: Invalid or missing token' }),
    ApiForbiddenResponse({ description: 'Forbidden: Insufficient permissions' }),
  );
}
