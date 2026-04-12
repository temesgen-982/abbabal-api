import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

describe('Auth and API keys flow (e2e)', () => {
  let app: INestApplication<App>;
  let username: string;
  let password: string;

  beforeAll(async () => {
    const testDatabaseUrl = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;

    if (!testDatabaseUrl) {
      throw new Error('TEST_DATABASE_URL or DATABASE_URL must be set for e2e tests');
    }

    process.env.DATABASE_URL = testDatabaseUrl;

    const { Test } = require('@nestjs/testing');
    const { AppModule } = require('../src/app.module');
    const { configureApp } = require('../src/setup-app');
    const { UsersService } = require('../src/users/users.service');
    const { ProverbsService } = require('../src/proverbs/proverbs.service');

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

    const proverbsService = app.get(ProverbsService);
    const existingProverb = await proverbsService.random();

    if (!existingProverb) {
      await proverbsService.create({
        text: 'E2E proverb',
      });
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
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
