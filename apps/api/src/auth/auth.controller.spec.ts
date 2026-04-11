import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { signIn: jest.Mock };

  beforeEach(() => {
    authService = {
      signIn: jest.fn(),
    };
    controller = new AuthController(authService as unknown as AuthService);
  });

  it('delegates login to AuthService.signIn with the authenticated user', async () => {
    const user = { userId: 3, username: 'admin' };
    const loginResult = {
      accessToken: 'jwt-token',
      user: {
        id: 3,
        name: 'admin',
      },
    };
    authService.signIn.mockResolvedValue(loginResult);

    await expect(controller.login({ user })).resolves.toEqual(loginResult);
    expect(authService.signIn).toHaveBeenCalledWith(user);
  });

  it('returns request.user from the profile endpoint', () => {
    const request = {
      user: {
        id: 3,
        username: 'admin',
      },
    };

    expect(controller.getUserProfile(request)).toEqual(request.user);
  });
});
