import { ConflictException, Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle.service';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(private drizzle: DrizzleService) {}

  findByUsername(username: string) {
    return this.drizzle.db.query.users.findFirst({
      where: eq(users.username, username) 
    });
  }

  async findAll() {
    return this.drizzle.db.query.users.findMany({
      columns: {
        password: false,
      },
    });
  }

  async create(username: string, password: string, role: Role = Role.USER) {
    
    const existing = await this.findByUsername(username);
    
    if (existing) {
        throw new ConflictException('Username already taken'); 
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await this.drizzle.db
      .insert(users)
      .values({ 
        username, 
        password: hashedPassword,
        role: role
      })
      .returning();
    return user;
  }
}
