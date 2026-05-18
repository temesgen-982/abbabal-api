import { ExecutionContext } from '@nestjs/common';
import { ApiKeysService } from '../api-keys.service';
import { OptionalApiKeyGuard } from './optional-api-key.guard';

describe('OptionalApiKeyGuard', () => {
  let guard: OptionalApiKeyGuard;
  let validateKey: jest.Mock;

  const createContext = (request: Record<string, any>): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as ExecutionContext;

  beforeEach(() => {
    validateKey = jest.fn();
    guard = new OptionalApiKeyGuard({
      validateKey,
    } as unknown as ApiKeysService);
  });

  it('allows requests without API key and does not validate', async () => {
    const request = { headers: {} };

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);
    expect(validateKey).not.toHaveBeenCalled();
  });

  it('attaches apiKey and user when API key is valid', async () => {
    const request = { headers: { 'x-api-key': 'valid-key' } };
    validateKey.mockResolvedValue({
      id: 10,
      name: 'Primary Key',
      userId: 20,
      user: { id: 20, email: 'user@example.com', role: 'USER' },
    });

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);

    expect(validateKey).toHaveBeenCalledWith('valid-key');
    expect(request.apiKey).toEqual({ id: 10, name: 'Primary Key', userId: 20 });
    expect(request.user).toEqual({
      id: 20,
      email: 'user@example.com',
      role: 'USER',
    });
  });

  it('removes invalid API key header so rate limiting falls back to anonymous tracker', async () => {
    const request = { headers: { 'x-api-key': 'invalid-key' } };
    validateKey.mockResolvedValue(null);

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);

    expect(validateKey).toHaveBeenCalledWith('invalid-key');
    expect(request.headers['x-api-key']).toBeUndefined();
    expect(request.apiKey).toBeUndefined();
    expect(request.user).toBeUndefined();
  });
});
