import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';
import { jwtConfig } from 'src/configs/jwt-config';

type AuthInput = {
    email: string;
    password: string;
    name?: string;
}
type signInData = {
    userId: number;
    email: string;
    role: Role;
    name?: string | null;
}
type AuthResult = {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        name?: string | null;
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
            throw new UnauthorizedException('Invalid email or password');
        }
        
        return this.signIn(user);
    }

    async validateUser(input: AuthInput): Promise<signInData | null> {
        const user = await this.usersService.findByEmail(input.email);
        if (!user || !(await bcrypt.compare(input.password, user.password))) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const role = normalizeRole(user.role);

        if (!role) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return {
            userId: user.id,
            email: user.email,
            role: user.role as Role,
            name: user.name,
        };
    }

    async signIn(user: signInData): Promise<AuthResult> {
        await this.usersService.updateLastLogin(user.userId);

        const payload = { 
            sub: user.userId, 
            email: user.email,
            role: user.role,
            name: user.name,
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
                name: user.name,
                role: user.role,
            }
        };
    }

    async refreshTokens(userId: number, email: string, name: string | undefined, role: Role): Promise<AuthResult>{
        return this.signIn({ userId, email, name, role });
    }

    async register(input: AuthInput): Promise<AuthResult> {
        const existingUser = await this.usersService.findByEmail(input.email);
        
        if (existingUser) {
            throw new ConflictException('Email already taken');
        }

        const user = await this.usersService.create(
            input.email, 
            input.password,
            Role.USER,
            input.name,
        );

        return this.signIn({
            userId: user.id,
            email: user.email,
            role: Role.USER,
            name: user.name,
        });
    }
}
