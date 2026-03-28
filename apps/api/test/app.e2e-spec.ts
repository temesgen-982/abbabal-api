import { INestApplication } from '@nestjs/common';
import { copyFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import request from 'supertest';
import { App } from 'supertest/types';

describe('Auth and API keys flow (e2e)', () => {
  let app: INestApplication<App>;
  let testDbPath: string;
  let username: string;
  let password: string;

  beforeAll(async () => {
    const dbFilename = `proverbs.e2e.${Date.now()}.db`;
    const sourceDbPath = join(process.cwd(), 'data', 'proverbs.db');

    testDbPath = join(process.cwd(), 'data', dbFilename);
    copyFileSync(sourceDbPath, testDbPath);
    process.env.DATABASE_URL = `file:./data/${dbFilename}`;

    const { Test } = require('@nestjs/testing');
    const { AppModule } = require('../src/app.module');
    const { configureApp } = require('../src/setup-app');
    const { UsersService } = require('../src/users/users.service');
    const { PrismaService } = require('../src/prisma.service');

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    username = `e2e-user-${Date.now()}`;
    password = 'e2e-password';

    const usersService = app.get(UsersService);
    await usersService.create(username, password);

    const prisma = app.get(PrismaService);
    const proverbCount = await prisma.proverb.count();

    if (proverbCount === 0) {
      await prisma.proverb.create({
        data: {
          date: new Date(),
          text: 'E2E proverb',
          views: 0,
          forwards: 0,
        },
      });
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    rmSync(testDbPath, { force: true });
  });

  async function createAuthenticatedApiKey() {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username,
        password,
      })
      .expect(201);

    const accessToken = loginResponse.body.accessToken as string;

    const apiKeyResponse = await request(app.getHttpServer())
      .post('/api-keys')
      .set('authorization', `Bearer ${accessToken}`)
      .send({
        name: `E2E Key ${Date.now()}`,
      })
      .expect(201);

    return {
      accessToken,
      apiKey: apiKeyResponse.body.key as string,
    };
  }

  it('rejects invalid API key payloads through the global ValidationPipe', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username,
        password,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api-keys')
      .set('authorization', `Bearer ${loginResponse.body.accessToken as string}`)
      .send({
        name: 'A',
        extra: 'not-allowed',
      })
      .expect(400);
  });

  it('rejects invalid login payloads before authentication runs', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username,
        extra: 'not-allowed',
      })
      .expect(400);
  });

  it('logs in, creates an API key, accesses proverbs, and rate limits by API key', async () => {
    const { apiKey } = await createAuthenticatedApiKey();

    await request(app.getHttpServer())
      .get('/proverbs/random')
      .set('x-api-key', apiKey)
      .expect(200);

    await request(app.getHttpServer())
      .get('/proverbs/random')
      .set('x-api-key', apiKey)
      .expect(200);

    await request(app.getHttpServer())
      .get('/proverbs/random')
      .set('x-api-key', apiKey)
      .expect(200);

    await request(app.getHttpServer())
      .get('/proverbs/random')
      .set('x-api-key', apiKey)
      .expect(429);
  });
});
