import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export enum ProverbSource {
  TELEGRAM = 'telegram',
  USER = 'user',
  ADMIN_IMPORT = 'admin_import',
}

export enum ProverbStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class CreateProverbDto {
  @ApiProperty({
    example: 'የሚጠይቅ አይሳሳትም',
    description: 'Original proverb text.',
  })
  @IsString()
  @MinLength(1)
  text: string;

  @ApiProperty({
    enum: ProverbSource,
    example: ProverbSource.TELEGRAM,
    description: 'Origin of the proverb record.',
  })
  @IsEnum(ProverbSource)
  source: ProverbSource;

  @ApiPropertyOptional({
    enum: ProverbStatus,
    example: ProverbStatus.APPROVED,
    description: 'Moderation status for the proverb.',
  })
  @IsOptional()
  @IsEnum(ProverbStatus)
  status?: ProverbStatus;

  @ApiPropertyOptional({
    example: '12345',
    description: 'Telegram message ID (required when source is telegram).',
  })
  @ValidateIf((dto: CreateProverbDto) => dto.source === ProverbSource.TELEGRAM)
  @IsString()
  @MinLength(1)
  telegramMessageId?: string;

  @ApiPropertyOptional({
    example: '2026-04-12T10:00:00.000Z',
    description: 'Original proverb date.',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    example: '2026-04-12T10:05:00.000Z',
    description: 'Time when proverb was collected.',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  scrapedAt?: string;
}
