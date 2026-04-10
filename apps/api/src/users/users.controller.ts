// src/users/users.controller.ts
import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from '../common/decorators/auth.decorator';
import { Role } from '../common/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth(Role.ADMIN) // Only Admins can create new users/admins
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(
      createUserDto.username,
      createUserDto.password,
      createUserDto.role,
    );
  }

  @Get()
  @Auth(Role.ADMIN) // Only Admins can see the full user list
  @ApiOperation({ summary: 'List all users (Admin only)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @Auth(Role.USER, Role.ADMIN) // Both roles can see their own info
  @ApiOperation({ summary: 'Get current logged-in user info' })
  getProfile(@Request() req) {
    return req.user; 
  }
}
