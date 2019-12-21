/**
 * Copyright (c) 2019 Paul Armstrong
 */
import crypto from 'crypto';
import request from 'supertest';
import express, { Request, Response } from 'express';
import { nonce, props } from '../server';

const nonceValue = '12345-12345-12345-12345';

describe('server', () => {
  beforeEach(() => {
    jest.spyOn(crypto, 'randomBytes').mockImplementation(() => ({ toString: () => nonceValue }));
  });

  describe('locals', () => {
    const localsToBody = (_req: Request, res: Response): void => {
      res.send(res.locals);
    };

    test('nonce', () => {
      const app = express();
      app.use(nonce);
      app.get('/', localsToBody);
      return request(app)
        .get('/')
        .then(res => {
          expect(res.body.nonce).toEqual(nonceValue);
        });
    });

    describe('props', () => {
      test('sets artifactConfig', () => {
        const app = express();
        const config = { artifacts: {} };
        app.use(props(config, 'https://build-tracker.local'));
        app.get('/', localsToBody);
        return request(app)
          .get('/')
          .then(res => {
            expect(res.body.props).toMatchObject({
              artifactConfig: config.artifacts,
              url: 'https://build-tracker.local'
            });
          });
      });

      test('defaults artifactConfig to empty object', () => {
        const app = express();
        const config = {};
        app.use(props(config, 'https://build-tracker.local'));
        app.get('/', localsToBody);
        return request(app)
          .get('/')
          .then(res => {
            expect(res.body.props).toMatchObject({
              artifactConfig: {},
              url: 'https://build-tracker.local'
            });
          });
      });

      test('sets url', () => {
        const app = express();
        const config = { artifacts: {} };
        app.use(props(config, 'https://build-tracker.local'));
        app.get('/', localsToBody);
        return request(app)
          .get('/')
          .then(res => {
            expect(res.body.props).toMatchObject({
              url: 'https://build-tracker.local'
            });
          });
      });

      test('defaults name to "Build Tracker"', () => {
        const app = express();
        const config = { artifacts: {} };
        app.use(props(config, 'https://build-tracker.local'));
        app.get('/', localsToBody);
        return request(app)
          .get('/')
          .then(res => {
            expect(res.body.props).toMatchObject({
              name: 'Build Tracker'
            });
          });
      });
    });

    test('overrides name if set in config', () => {
      const app = express();
      const config = { artifacts: {}, name: 'Tacos' };
      app.use(props(config, 'https://build-tracker.local'));
      app.get('/', localsToBody);
      return request(app)
        .get('/')
        .then(res => {
          expect(res.body.props).toMatchObject({
            name: 'Tacos'
          });
        });
    });
  });
});
