/**
 * Copyright (c) 2019 Paul Armstrong
 */
import express from 'express';
import request from 'supertest';
import serverRenderer from '../';
import uuid from 'uuid';

describe('Server', () => {
  beforeEach(() => {
    jest.spyOn(uuid, 'v4').mockReturnValue('12345-67890-12345-67890');
  });

  test('returns 500 no stats config', () => {
    const app = express();
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
      const app = express();
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
      const app = express();
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
      const app = express();
      app.get('/', serverRenderer({ children: [{ name: 'client', assetsByChunkName: { app: 'app.js' } }] }));

      return request(app)
        .get('/')
        .then(res => {
          expect(res.text).toMatch('<script nonce="12345-67890-12345-67890" src="/client/app.js"></script>');
        });
    });
  });
});
