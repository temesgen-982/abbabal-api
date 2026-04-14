import '../load-env';

type ExpiresIn =
  | number
  | `${number}${'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y'}`;

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const jwtConfig = {
  secret: getRequiredEnv('JWT_SECRET'),
  expiresIn: (process.env.JWT_EXPIRES_IN ?? '15m') as ExpiresIn,
  refreshSecret: getRequiredEnv('JWT_REFRESH_SECRET'),
  refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '1w') as ExpiresIn,
};
