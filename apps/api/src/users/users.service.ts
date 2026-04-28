import { ConflictException, NotFoundException, Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle.service';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private drizzle: DrizzleService) {}

  findByEmail(email: string) {
    return this.drizzle.db.query.users.findFirst({
      where: eq(users.email, email) 
    });
  }

  async findAll() {
    return this.drizzle.db.query.users.findMany({
      columns: {
        password: false,
      },
    });
  }

  async create(email: string, password: string, role: Role = Role.USER, name?: string) {
    
    const existing = await this.findByEmail(email);
    
    if (existing) {
        throw new ConflictException('Email already taken'); 
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await this.drizzle.db
      .insert(users)
      .values({ 
        email, 
        password: hashedPassword,
        role,
        name,
      })
      .returning({
         id: users.id,
         email: users.email,
         role: users.role,
         name: users.name,
       });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const dataToUpdate: Partial<UpdateUserDto> & { updatedAt: Date } = { 
      ...updateUserDto,
      updatedAt: new Date()
    };

    // Logic check: If a password is being updated, hash it first
    if (updateUserDto.password) {
      dataToUpdate.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const [user] = await this.drizzle.db
      .update(users)
      .set(dataToUpdate)
      .where(eq(users.id, id))
      .returning();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, ...result } = user;
    return result;
  }

  async updateLastLogin(id: number) {
    return this.drizzle.db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, id));
  }
}
