import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InterpretationDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  proverbId: number;

  @ApiProperty({ example: 'translation' })
  type: string;

  @ApiProperty({ example: 'en' })
  language: string;

  @ApiProperty({ example: 'Wisdom begins with listening.' })
  content: string;

  @ApiPropertyOptional({ example: 'Gemini 2.5 Flash' })
  model?: string | null;

  @ApiPropertyOptional({ example: 0.94 })
  confidence?: number | null;

  @ApiProperty({ example: false })
  needsReview: number;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  createdAt: string;

  @ApiPropertyOptional({ example: '2026-03-25T12:15:00.000Z' })
  updatedAt?: string | null;
}

export class ProverbDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'በውኃ ላይ የተጻፈ' })
  text: string;

  @ApiProperty({ example: '2026-03-25T00:00:00.000Z' })
  date: string;

  @ApiProperty({ example: 42 })
  views: number;

  @ApiProperty({ example: 10 })
  forwards: number;

  @ApiProperty({ example: 'telegram' })
  source: string;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  scrapedAt: string;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  createdAt: string;

  @ApiPropertyOptional({ example: '2026-03-25T12:15:00.000Z' })
  updatedAt?: string | null;

  @ApiPropertyOptional({ type: InterpretationDto, isArray: true })
  interpretations?: InterpretationDto[];
}

export class PaginatedProverbsDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 7576 })
  total: number;

  @ApiProperty({ type: ProverbDto, isArray: true })
  results: ProverbDto[];
}
