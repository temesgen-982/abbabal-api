import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { ProverbsService } from './proverbs.service';
import { resolve } from 'node:path';

@ApiTags('Proverbs')
@Controller('proverbs')
export class ProverbsController {
  constructor(private readonly proverbsService: ProverbsService) {}

  @Get()
  @ApiOperation({ summary: 'List proverbs with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 20;
    return this.proverbsService.findAll(pageNumber, limitNumber);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search proverbs by text or translations' })
  @ApiQuery({ name: 'q', required: true, type: String, example: 'wisdom' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  search(@Query('q') query: string, @Query('limit') limit: string) {
    const limitNumber = parseInt(limit, 10) || 20;
    return this.proverbsService.search(query, limitNumber);
  }

  @Get('random')
  @ApiOperation({ summary: 'Get a random proverb' })
  random() {
    return this.proverbsService.random();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a proverb by ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string) {
    return this.proverbsService.findOne(parseInt(id));
  }
}
