# Auth and User Code Dump

This document contains the exact current source for the auth module, user module, and shared common decorators.

---

## File: apps/api/src/auth/auth.module.ts

```typescript
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/configs/jwt-config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.expiresIn },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

---

## File: apps/api/src/auth/auth.controller.ts

```typescript
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto, ProfileResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshAuth } from './decorators/refresh-auth.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('refresh')
  @RefreshAuth()
  @ApiOkResponse({ type: AuthResponseDto })
  async refresh(@Request() req) {
    const { userId, username, role } = req.user;
    return this.authService.refreshTokens(userId, username, role);
  }

  @Post('login')
  @UseGuards(PassportLocalGuard)
  @ApiOperation({ summary: 'Log in with username and password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid username or password.' })
  login(@Request() request) {
    return this.authService.signIn(request.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ type: AuthResponseDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get the currently authenticated user profile' })
  @ApiOkResponse({ type: ProfileResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  getUserProfile(@Request() request) {
    return request.user;
  }
}
```

---

## File: apps/api/src/auth/auth.service.ts

```typescript
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';
import { jwtConfig } from 'src/configs/jwt-config';

type AuthInput = {
    username: string;
    password: string;
}
type signInData = {
    userId: number;
    username: string;
    role: Role;
}
type AuthResult = {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        name: string;
        role: Role;
    }
}

function normalizeRole(role: unknown): Role | undefined {
    if (typeof role !== 'string') {
        return undefined;
    }

    const normalizedRole = role.toLowerCase();

    if ((Object.values(Role) as string[]).includes(normalizedRole)) {
        return normalizedRole as Role;
    }

    return undefined;
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async authenticate(input: AuthInput): Promise<AuthResult> {
        const user = await this.validateUser(input);

        if (!user) {
            throw new UnauthorizedException('Invalid username or password');
        }
        
        return this.signIn(user);
    }

    async validateUser(input: AuthInput): Promise<signInData | null> {
        const user = await this.usersService.findByUsername(input.username);
        if (!user || !(await bcrypt.compare(input.password, user.password))) {
            throw new UnauthorizedException('Invalid username or password');
        }

        const role = normalizeRole(user.role);

        if (!role) {
            throw new UnauthorizedException('Invalid username or password');
        }

        return {
            userId: user.id,
            username: user.username,
            role,
        };
    }

    async signIn(user: signInData): Promise<AuthResult> {
        const payload = { 
            sub: user.userId, 
            username: user.username,
            role: user.role,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, {
                secret: jwtConfig.refreshSecret,
                expiresIn: jwtConfig.refreshExpiresIn,
            }),
        ])

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.userId,
                name: user.username,
                role: user.role,
            }
        };
    }

    async refreshTokens(userId: number, username: string, role: Role): Promise<AuthResult>{
        return this.signIn({userId, username, role});
    }

    async register(input: AuthInput): Promise<AuthResult> {
        const existingUser = await this.usersService.findByUsername(input.username);
        
        if (existingUser) {
            throw new ConflictException('Username already taken');
        }

        const user = await this.usersService.create(
            input.username, 
            input.password,
            Role.USER
        );

        return this.signIn({
            userId: user.id,
            username: user.username,
            role: Role.USER,
        });
    }
}
```

---

## File: apps/api/src/auth/guards/passport-local.guard.ts

```typescript
import { ExecutionContext, Injectable, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { from, isObservable, Observable, of, switchMap } from 'rxjs';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class PassportLocalGuard extends AuthGuard('local') {
  private readonly validationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

  canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return from(
      this.validationPipe.transform(request.body, {
        type: 'body',
        metatype: LoginDto,
      }),
    ).pipe(
      switchMap((validatedBody) => {
        request.body = validatedBody;

        const result = super.canActivate(context);

        if (isObservable(result)) {
          return result;
        }

        if (typeof result === 'boolean') {
          return of(result);
        }

        return from(result);
      }),
    );
  }
}
```

---

## File: apps/api/src/auth/guards/jwt-auth.guard.ts

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

---

## File: apps/api/src/auth/guards/jwt-refresh.guard.ts

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
```

---

## File: apps/api/src/auth/decorators/refresh-auth.decorator.ts

```typescript
import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiOperation } from '@nestjs/swagger';

export function RefreshAuth() {
  return applyDecorators(
    UseGuards(JwtRefreshGuard),
    ApiBearerAuth('bearer'),
    ApiOperation({ summary: 'Refresh access token using a valid refresh token' }),
    ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' }),
  );
}
```

---

## File: apps/api/src/auth/strategies/local.strategy.ts

```typescript
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser({ username, password });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
```

---

## File: apps/api/src/auth/strategies/jwt.strategy.ts

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from 'src/configs/jwt-config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
```

---

## File: apps/api/src/auth/strategies/jwt-refresh.strategy.ts

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from 'src/configs/jwt-config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.refreshSecret,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
```

---

## File: apps/api/src/auth/dto/login.dto.ts

```typescript
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
```

---

## File: apps/api/src/auth/dto/register.dto.ts

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RegisterDto {
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
```

---

## File: apps/api/src/auth/dto/auth-response.dto.ts

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';

export class AuthUserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'admin' })
  name: string;

  @ApiProperty({ enum: Role, example: Role.ADMIN })
  role: Role;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token.',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eflskdjhfdGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT refresh token.',
  })
  refreshToken: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}

export class ProfileResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ enum: Role, example: Role.ADMIN })
  role: Role;
}
```

---

## File: apps/api/src/users/users.module.ts

```typescript
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
```

---

## File: apps/api/src/users/users.controller.ts

```typescript
// src/users/users.controller.ts
import { Controller, Get, Post, Patch, Param, ParseIntPipe, Body, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from '../common/decorators/auth.decorator';
import { Role } from '../common/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @Patch(':id')
@Auth(Role.ADMIN) // Only admins can promote/demote users
@ApiOperation({ summary: 'Update user details or role (Admin only)' })
update(
  @Param('id', ParseIntPipe) id: number, 
  @Body() updateUserDto: UpdateUserDto
) {
  return this.usersService.update(id, updateUserDto);
}
}
```

---

## File: apps/api/src/users/users.service.ts

```typescript
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
      .returning({
         id: users.id,
         username: users.username,
         role: users.role,
       });
    return user;
  }

  async update(id: number, updateUserDto: any) {
    const dataToUpdate: any = { 
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
}
```

---

## File: apps/api/src/users/dto/create-user.dto.ts

```typescript
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
```

---

## File: apps/api/src/users/dto/update-user.dto.ts

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class UpdateUserDto {
  @ApiProperty({ example: 'newusername', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ enum: Role, required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ example: 'thisisastrongpassword', required: false })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
```

---

## File: apps/api/src/common/decorators/auth.decorator.ts

```typescript
import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { Roles } from './roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    Roles(roles),
    // (Auth first, then Roles)
    UseGuards(JwtAuthGuard, RolesGuard),
    
    ApiBearerAuth('bearer'),
    ApiUnauthorizedResponse({ description: 'Unauthorized: Invalid or missing token' }),
    ApiForbiddenResponse({ description: 'Forbidden: Insufficient permissions' }),
  );
}
```

---

## File: apps/api/src/common/decorators/roles.decorator.ts

```typescript
import { Reflector } from "@nestjs/core";
import { Role } from "../enums/role.enum";

export const Roles = Reflector.createDecorator<Role[]>();
```

---

## File: apps/api/src/common/decorators/api-auth.decorator.ts

```typescript
import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { Roles } from './roles.decorator';
import { ApiKeyGuard } from 'src/api-keys/guards/api-key.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiSecurity } from '@nestjs/swagger';
import { RateLimitGuard } from 'src/api-keys/guards/rate-limit.guard';

export function ApiAuth(...roles: Role[]) {
  return applyDecorators(
    Roles(roles),
    UseGuards(ApiKeyGuard, RolesGuard, RateLimitGuard),
    ApiSecurity('apiKey'), // Swagger
  );
}
```

---

## File: apps/api/src/common/guards/roles.guard.ts

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get the required roles from the @Roles decorator
    const requiredRoles = this.reflector.get(Roles, context.getHandler());
    
    // 2. If no roles are defined on the route, allow access (public within the module)
    if (!requiredRoles) {
      return true;
    }

    // 3. Get the user from the request (populated by JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    // 4. Check if the user exists and has the required role
    // .includes in case need to support multiple roles per user later
    return requiredRoles.some((role) => user?.role === role);
  }
}
```
