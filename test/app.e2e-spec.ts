import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    request(app.getHttpServer())
      .post('/users/signup')
      .send({
        username: 'Maria Doe',
        password: 'Password',
      })
      .then((response) => {
        userId = response.body.id;
      });
  });

  it('/users/signup (POST)', () => {
    return request(app.getHttpServer())
      .post('/users/signup')
      .send({
        username: 'John Doe',
        password: 'Password',
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          id: expect.any(String),
          username: 'John Doe',
          account: {
            id: expect.any(String),
          },
        });
      });
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'John Doe',
        password: 'Password',
      })
      .expect(200)
      .then((response) => {
        authToken = response.body.access_token;
        expect(response.body).toEqual({
          access_token: expect.any(String),
        });
      });
  });

  it('/users/balance (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/balance')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          balance: 100,
          id: expect.any(String),
        });
      });
  });

  it('/users/transfer (POST)', () => {
    return request(app.getHttpServer())
      .post('/users/transfer')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        amount: 10,
        creditedId: userId,
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          value: 10,
          creditedAccountId: expect.any(String),
          debitedAccountId: expect.any(String),
          id: expect.any(String),
          createdAt: expect.any(String),
        });
      });
  });

  it('/users/transactions (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual([
          {
            value: 10,
            creditedAccountId: expect.any(String),
            debitedAccountId: expect.any(String),
            id: expect.any(String),
            createdAt: expect.any(String),
          },
        ]);
      });
  });

  it('/users/transactions (GET) with operation and date', () => {
    const date = new Date().toISOString().split('T')[0];
    return request(app.getHttpServer())
      .get('/users/transactions?operation=debit&date=' + date)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual([
          {
            value: 10,
            creditedAccountId: expect.any(String),
            debitedAccountId: expect.any(String),
            id: expect.any(String),
            createdAt: expect.any(String),
          },
        ]);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
