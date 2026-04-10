import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';

type AuthInput = {
    username: string;
    password: string;
}
type signInData = {
    userId: number;
    username: string;
    role: string;
}
type AuthResult = {
    accessToken: string;
    user: {
        id: number;
        name: string;
    }
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
        return {
            userId: user.id,
            username: user.username,
            role: user.role,
        };
    }

    async signIn(user: signInData): Promise<AuthResult> {
        const payload = { 
            sub: user.userId, 
            username: user.username,
            role: user.role,
        };
        const accessToken = await this.jwtService.signAsync(payload);
        return {
            accessToken,
            user: {
                id: user.userId,
                name: user.username,
            }
        };
    }

    async register(input: AuthInput): Promise<AuthResult> {
        const existingUser = await this.usersService.findByUsername(input.username);
        
        if (existingUser) {
            throw new UnauthorizedException('Username already exists');
        }

        const user = await this.usersService.create(
            input.username, 
            input.password,
            Role.USER
        );

        return this.signIn({
            userId: user.id,
            username: user.username,
            role: user.role as string,
        });
    }
}
