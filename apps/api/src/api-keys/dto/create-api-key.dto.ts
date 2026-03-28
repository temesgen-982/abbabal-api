import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateApiKeyDto {
  @ApiProperty({
    example: 'My API Key',
    minLength: 2,
    maxLength: 50,
    description: 'A human-readable label for the API key.',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}
