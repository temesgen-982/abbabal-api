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
