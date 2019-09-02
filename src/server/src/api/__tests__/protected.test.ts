/**
 * Copyright (c) 2019 Paul Armstrong
 */
import protectedMiddleware from '../protected';
import request from 'supertest';
import express, { Request, Response } from 'express';

const respondPath = (req: Request, res: Response): void => {
  res.send(req.path);
};

describe('protectedMiddleware', () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(protectedMiddleware);
  });

  test('if not GET, HEAD or OPTIONS, goes to next', async () => {
    app.get('/foo', respondPath);
    app.options('/foo', respondPath);
    await expect(request(app).get('/foo')).resolves.toMatchObject({ status: 200, text: '/foo' });
    await expect(request(app).options('/foo')).resolves.toMatchObject({ status: 200, text: '/foo' });
  });

  describe('without env var set', () => {
    test('if POST, goes to nextt', async () => {
      app.post('/foo', respondPath);
      await expect(request(app).post('/foo')).resolves.toMatchObject({ status: 200, text: '/foo' });
    });

    test('if PUT, goes to nextt', async () => {
      app.put('/foo', respondPath);
      await expect(request(app).put('/foo')).resolves.toMatchObject({ status: 200, text: '/foo' });
    });

    test('if DELETE, goes to nextt', async () => {
      app.delete('/foo', respondPath);
      await expect(request(app).delete('/foo')).resolves.toMatchObject({ status: 200, text: '/foo' });
    });
  });

  describe('with env var set', () => {
    let prevToken;
    beforeEach(() => {
      prevToken = process.env.BT_API_AUTH_TOKEN;
      process.env.BT_API_AUTH_TOKEN = 'test-token';
    });

    afterEach(() => {
      process.env.BT_API_AUTH_TOKEN = prevToken;
    });

    test('fails if auth header is not set', async () => {
      app.post('/foo', respondPath);
      await expect(request(app).post('/foo')).resolves.toMatchObject({ status: 401 });
    });

    test('fails if auth header not equal to the token', async () => {
      app.post('/foo', respondPath);
      await expect(
        request(app)
          .post('/foo')
          .set('x-bt-auth', 'abcd')
      ).resolves.toMatchObject({ status: 401 });
    });

    test('succeeds if auth header not equal to the token', async () => {
      app.post('/foo', respondPath);
      await expect(
        request(app)
          .post('/foo')
          .set('x-bt-auth', 'test-token')
      ).resolves.toMatchObject({ status: 200, text: '/foo' });
    });
  });
});
