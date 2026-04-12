import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Role } from 'src/common/enums/role.enum';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { findByUsername: jest.Mock };
  let jwtService: { signAsync: jest.Mock };

  beforeEach(() => {
    usersService = {
      findByUsername: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn(),
    };
    service = new AuthService(
      usersService as unknown as UsersService,
      jwtService as unknown as JwtService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('authenticates valid credentials and returns a signed token payload', async () => {
    usersService.findByUsername.mockResolvedValue({
      id: 1,
      username: 'admin',
      password: 'hashed-password',
      role: Role.ADMIN,
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('signed-jwt');

    await expect(
      service.authenticate({ username: 'admin', password: 'password' }),
    ).resolves.toEqual({
      accessToken: 'signed-jwt',
      user: {
        id: 1,
        name: 'admin',
        role: Role.ADMIN,
      },
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 1,
      username: 'admin',
      role: Role.ADMIN,
    });
  });

  it('throws UnauthorizedException when the password is invalid', async () => {
    usersService.findByUsername.mockResolvedValue({
      id: 1,
      username: 'admin',
      password: 'hashed-password',
      role: Role.ADMIN,
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.validateUser({ username: 'admin', password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('signs in using the expected JWT payload shape', async () => {
    jwtService.signAsync.mockResolvedValue('signed-jwt');

    await expect(
      service.signIn({ userId: 7, username: 'besho', role: Role.USER }),
    ).resolves.toEqual({
      accessToken: 'signed-jwt',
      user: {
        id: 7,
        name: 'besho',
        role: Role.USER,
      },
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 7,
      username: 'besho',
      role: Role.USER,
    });
  });
});
