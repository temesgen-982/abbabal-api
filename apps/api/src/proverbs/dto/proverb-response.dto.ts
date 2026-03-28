import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProverbDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2026-03-25T00:00:00.000Z', format: 'date-time' })
  date: string;

  @ApiProperty({ example: 'Wisdom begins with listening.' })
  text: string;

  @ApiProperty({ example: 42 })
  views: number;

  @ApiProperty({ example: 10 })
  forwards: number;

  @ApiPropertyOptional({ example: 'Wisdom begins with listening.' })
  englishTranslation?: string | null;

  @ApiPropertyOptional({ example: 'Patience and careful listening lead to understanding.' })
  amharicMeaning?: string | null;

  @ApiPropertyOptional({ example: 'The proverb encourages attentive listening.' })
  englishMeaning?: string | null;

  @ApiPropertyOptional({ example: 'Community translation project' })
  translationSource?: string | null;

  @ApiPropertyOptional({ example: 'Editorial review' })
  meaningSource?: string | null;

  @ApiProperty({ example: 0.94 })
  confidence: number;

  @ApiProperty({ example: false })
  needsReview: boolean;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z', format: 'date-time' })
  createdAt: string;

  @ApiPropertyOptional({
    example: '2026-03-25T12:15:00.000Z',
    format: 'date-time',
    nullable: true,
  })
  updatedAt?: string | null;
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
