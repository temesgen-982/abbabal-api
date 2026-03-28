import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin',
    description: 'Username for an existing account.',
  })
  @IsString()
  @MinLength(1)
  username: string;

  @ApiProperty({
    example: 'password',
    description: 'Password for the account.',
  })
  @IsString()
  @MinLength(1)
  password: string;
}
