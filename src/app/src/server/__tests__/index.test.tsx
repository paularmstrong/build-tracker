/**
 * Copyright (c) 2019 Paul Armstrong
 */
import request from 'supertest';
import serverRenderer from '../';
import express, { NextFunction, Request, Response } from 'express';

describe('Server', () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use((_req: Request, res: Response, next: NextFunction) => {
      res.locals.nonce = '12345-67890-12345-67890';
      next();
    });
  });

  test('returns 500 no stats config', () => {
    // @ts-ignore
    app.get('/', serverRenderer({}));

    return request(app)
      .get('/')
      .then(res => {
        expect(res.status).toBe(500);
      });
  });

  describe('CSS', () => {
    test('renders the CSS', () => {
      app.get('/', serverRenderer({ children: [{ name: 'client', assetsByChunkName: { app: 'app.js' } }] }));

      return request(app)
        .get('/')
        .then(res => {
          expect(res.text).toMatch('<style nonce="12345-67890-12345-67890" id="react-native-stylesheet">');
        });
    });
  });

  describe('Scripts', () => {
    test('are added in dev mode', () => {
      app.get(
        '/',
        serverRenderer({ clientStats: { name: 'client', assetsByChunkName: { app: ['app.js', 'tacos.js'] } } })
      );

      return request(app)
        .get('/')
        .then(res => {
          expect(res.text).toMatch('<script nonce="12345-67890-12345-67890" src="/client/app.js"></script>');
          expect(res.text).toMatch('<script nonce="12345-67890-12345-67890" src="/client/tacos.js"></script>');
        });
    });
    test('are added in prod mode', () => {
      app.get('/', serverRenderer({ children: [{ name: 'client', assetsByChunkName: { app: 'app.js' } }] }));

      return request(app)
        .get('/')
        .then(res => {
          expect(res.text).toMatch('<script nonce="12345-67890-12345-67890" src="/client/app.js"></script>');
        });
    });
  });
});
