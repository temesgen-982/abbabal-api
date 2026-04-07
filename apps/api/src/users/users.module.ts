import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DrizzleService } from '../drizzle.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, DrizzleService],
  exports: [UsersService],
})
export class UsersModule {}