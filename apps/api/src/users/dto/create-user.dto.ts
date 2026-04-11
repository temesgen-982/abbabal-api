import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: Role, required: true })
  @IsEnum(Role)
  role: Role;
}