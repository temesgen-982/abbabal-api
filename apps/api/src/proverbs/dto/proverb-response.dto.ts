import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InterpretationDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  proverbId: number;

  @ApiProperty({ example: 'translation', enum: ['translation', 'meaning'] })
  type: 'translation' | 'meaning';

  @ApiProperty({ example: 'en', enum: ['en', 'am'] })
  language: 'en' | 'am';

  @ApiProperty({ example: 'Wisdom begins with listening.' })
  content: string;

  @ApiProperty({ example: 'ai', enum: ['telegram', 'ai', 'user'] })
  source: 'telegram' | 'ai' | 'user';

  @ApiPropertyOptional({ example: 'gpt-5' })
  model?: string | null;

  @ApiPropertyOptional({ example: 0.94, nullable: true })
  confidence?: number | null;

  @ApiProperty({ example: false })
  isApproved: boolean;

  @ApiProperty({ example: true })
  needsReview: boolean;

  @ApiPropertyOptional({ example: 1, nullable: true })
  createdBy?: number | null;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z', format: 'date-time' })
  createdAt: string;

  @ApiPropertyOptional({
    example: '2026-03-25T12:15:00.000Z',
    format: 'date-time',
    nullable: true,
  })
  updatedAt?: string | null;
}

export class ProverbStatDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  proverbId: number;

  @ApiProperty({ example: 42 })
  views: number;

  @ApiProperty({ example: 10 })
  forwards: number;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z', format: 'date-time' })
  capturedAt: string;
}

export class ProverbDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Wisdom begins with listening.' })
  text: string;

  @ApiProperty({ example: 'telegram', enum: ['telegram', 'user', 'admin_import'] })
  source: 'telegram' | 'user' | 'admin_import';

  @ApiProperty({ example: 'approved', enum: ['pending', 'approved', 'rejected'] })
  status: 'pending' | 'approved' | 'rejected';

  @ApiPropertyOptional({ example: '12345', nullable: true })
  telegramMessageId?: string | null;

  @ApiPropertyOptional({ example: 1, nullable: true })
  createdBy?: number | null;

  @ApiProperty({ example: '2026-03-25T00:00:00.000Z', format: 'date-time' })
  date: string;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z', format: 'date-time' })
  scrapedAt: string;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z', format: 'date-time' })
  createdAt: string;

  @ApiProperty({ type: InterpretationDto, isArray: true })
  interpretations: InterpretationDto[];

  @ApiPropertyOptional({
    type: ProverbStatDto,
    nullable: true,
  })
  latestStats?: ProverbStatDto | null;
}

export class PaginatedProverbsDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 250 })
  total: number;

  @ApiProperty({ type: ProverbDto, isArray: true })
  results: ProverbDto[];
}
