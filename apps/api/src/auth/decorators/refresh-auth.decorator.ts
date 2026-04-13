import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiOperation } from '@nestjs/swagger';

export function RefreshAuth() {
  return applyDecorators(
    UseGuards(JwtRefreshGuard),
    ApiBearerAuth('bearer'),
    ApiOperation({ summary: 'Refresh access token using a valid refresh token' }),
    ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' }),
  );
}
