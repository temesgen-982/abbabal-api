import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email for an existing account.',
  })
  @IsEmail()
  @MinLength(1)
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'Password for the account.',
  })
  @IsString()
  @MinLength(1)
  password: string;
}
