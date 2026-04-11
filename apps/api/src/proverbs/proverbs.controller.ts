import { Controller, Get, Param, Body, Query, Post, Patch, Delete } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { ProverbsService } from './proverbs.service';
import { PaginatedProverbsDto, ProverbDto } from './dto/proverb-response.dto';
import { ApiAuth } from '../common/decorators/api-auth.decorator';
import { Auth } from '../common/decorators/auth.decorator';
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

    @Post()
    @Auth(Role.ADMIN) // Restricted to Admin via JWT
    @ApiOperation({ summary: 'Create a new proverb' })
    create(@Body() data: any) {
        return this.proverbsService.create(data);
    }

    @Patch(':id')
    @Auth(Role.ADMIN)
    @ApiOperation({ summary: 'Update an existing proverb' })
    update(@Param('id') id: string, @Body() data: any) {
        return this.proverbsService.update(parseInt(id), data);
    }

    @Delete(':id')
    @Auth(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a proverb' })
    remove(@Param('id') id: string) {
        return this.proverbsService.remove(parseInt(id));
    }

}
