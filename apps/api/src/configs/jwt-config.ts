import '../load-env';

type JwtExpiresIn =
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
  expiresIn: (process.env.JWT_EXPIRES_IN ?? '15m') as JwtExpiresIn,
};
