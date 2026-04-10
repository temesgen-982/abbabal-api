// src/proverbs/proverbs.controller.ts
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { ProverbsService } from './proverbs.service';
import { RateLimitGuard } from 'src/api-keys/guards/rate-limit.guard';
import { PaginatedProverbsDto, ProverbDto } from './dto/proverb-response.dto';
import { ApiAuth } from '../common/decorators/api-auth.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Proverbs')
@ApiTooManyRequestsResponse({ description: 'Rate limit exceeded for this API key.' })
@Controller('proverbs')
export class ProverbsController {
    constructor(private readonly proverbsService: ProverbsService) {}

    @Get()
    @ApiAuth(Role.USER, Role.ADMIN) // Both roles
    @ApiOperation({ summary: 'List proverbs with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
    @ApiOkResponse({ type: PaginatedProverbsDto })
    findAll(@Query('page') page: string, @Query('limit') limit: string) {
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 20;
        return this.proverbsService.findAll(pageNumber, limitNumber);
    }
    
    @Get('search')
    @ApiAuth(Role.USER, Role.ADMIN)
    @ApiOperation({ summary: 'Search proverbs by text or English translation' })
    @ApiQuery({ name: 'q', required: true, type: String, example: 'wisdom' })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
    @ApiOkResponse({ type: ProverbDto, isArray: true })
    search(@Query('q') query: string, @Query('limit') limit: string) {
        const limitNumber = parseInt(limit, 10) || 20;
        return this.proverbsService.search(query, limitNumber);
    }
    
    @Get('random')
    @ApiAuth(Role.USER, Role.ADMIN)
    @ApiOperation({ summary: 'Get a random proverb' })
    @ApiOkResponse({ type: ProverbDto })
    random() {
        return this.proverbsService.random();
    }
    
    @Get(':id')
    @ApiAuth(Role.USER, Role.ADMIN)
    @ApiOperation({ summary: 'Get a proverb by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Proverb ID.' })
    @ApiOkResponse({ type: ProverbDto })
    findOne(@Param('id') id: string) {
        const idNumber = parseInt(id);
        return this.proverbsService.findOne(idNumber);
    }
}
