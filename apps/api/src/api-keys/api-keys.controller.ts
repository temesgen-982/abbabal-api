import { Controller, Post, Body, UseGuards, Request, Get, Param, Delete } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import {
  ApiKeyListItemDto,
  CreateApiKeyResponseDto,
  RevokedApiKeyResponseDto,
} from './dto/api-key-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('API Keys')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
@Controller('api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new API key for the authenticated user' })
  @ApiCreatedResponse({
    type: CreateApiKeyResponseDto,
    description: 'Returns the raw API key once at creation time.',
  })
  async create(@Request() req, @Body() createApiKeyDto: CreateApiKeyDto) {
    return this.apiKeysService.create(req.user.id, createApiKeyDto.name);
  }

  @Get()
  @ApiOperation({ summary: 'List API keys for the authenticated user' })
  @ApiOkResponse({ type: ApiKeyListItemDto, isArray: true })
  async findAll(@Request() req) {
    return this.apiKeysService.findAllForUser(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate an API key' })
  @ApiParam({ name: 'id', type: Number, description: 'API key ID.' })
  @ApiOkResponse({ type: RevokedApiKeyResponseDto })
  @ApiNotFoundResponse({ description: 'API key not found.' })
  async revoke(@Request() req, @Param('id') id: string) {
    return this.apiKeysService.revoke(req.user.id, Number(id));
  }
}
