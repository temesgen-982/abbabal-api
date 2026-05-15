import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @ApiProperty({ example: 'Abebe Bekalu', required: false })
  @IsString()
  @IsOptional()
  name?: string;
}
