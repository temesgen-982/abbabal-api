import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApiKeyResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'My API Key' })
  name: string;

  @ApiProperty({
    example: 'cc3ee0572cfbfb945be0ecbb27fc37aed385daa814678e07707e85b4aeeed818',
    description: 'Raw API key. This value is only returned once at creation time.',
  })
  key: string;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z', format: 'date-time' })
  createdAt: string;
}

export class ApiKeyListItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'My API Key' })
  name: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiPropertyOptional({
    example: '2026-03-25T12:10:00.000Z',
    format: 'date-time',
    nullable: true,
  })
  lastUsedAt?: string | null;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z', format: 'date-time' })
  createdAt: string;

  @ApiProperty({ example: '2026-03-25T12:15:00.000Z', format: 'date-time' })
  updatedAt: string;
}

export class RevokedApiKeyResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'My API Key' })
  name: string;

  @ApiProperty({ example: false })
  isActive: boolean;
}
