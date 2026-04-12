import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class SubmitProverbDto {
  @ApiProperty({
    example: 'የሚጠይቅ አይሳሳትም',
    description: 'Original proverb text submitted by a user.',
  })
  @IsString()
  @MinLength(1)
  text: string;

  @ApiPropertyOptional({
    example: '2026-04-12T10:00:00.000Z',
    description: 'Optional original proverb date.',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}
