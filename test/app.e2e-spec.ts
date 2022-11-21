import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  console.log(process.env.NODE_ENV);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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

  afterAll(async () => {
    await app.close();
  });
});
