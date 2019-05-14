/**
 * Copyright (c) 2019 Paul Armstrong
 */
import bodyParser from 'body-parser';
import Build from '@build-tracker/build';
import Comparator from '@build-tracker/comparator';
import express from 'express';
import { insertBuild } from '../insert';
import request from 'supertest';

const build = new Build({ branch: 'master', revision: 'abc', parentRevision: 'def', timestamp: Date.now() }, []);
const parentBuild = new Build({ branch: 'master', revision: 'def', parentRevision: '123', timestamp: Date.now() }, []);

describe('insert build handler', () => {
  let queries, app;
  beforeEach(() => {
    queries = {
      byRevision: jest.fn(() => Promise.resolve(parentBuild)),
      insert: jest.fn(() => Promise.resolve('1234'))
    };
    app = express();
    app.use(bodyParser.json());
  });

  describe('insert', () => {
    test('inserts the build', () => {
      const handler = insertBuild(queries, { artifacts: {} });
      app.post('/test', handler);

      return request(app)
        .post('/test')
        .send({ meta: build.meta, artifacts: build.artifacts })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then(() => {
          expect(queries.insert).toHaveBeenCalled();
        });
    });
  });

  describe('response', () => {
    test('includes the comparator JSON', () => {
      const handler = insertBuild(queries, { artifacts: {} });
      app.post('/test', handler);

      return request(app)
        .post('/test')
        .send({ meta: build.meta, artifacts: build.artifacts })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then(res => {
          expect(res.body).toMatchObject({ comparator: new Comparator({ builds: [build, parentBuild] }).toJSON() });
        });
    });
  });

  describe('onInserted', () => {
    test('called with a comparator of the inserted branch against its parentRevision', () => {
      const handleInsert = jest.fn(() => Promise.resolve());
      const handler = insertBuild(queries, { artifacts: {} }, handleInsert);
      app.post('/test', handler);

      return request(app)
        .post('/test')
        .send({ meta: build.meta, artifacts: build.artifacts })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then(() => {
          expect(handleInsert).toHaveBeenCalled();
          // @ts-ignore
          const [comparator] = handleInsert.mock.calls[0];
          // @ts-ignore
          expect(comparator.builds.map(build => build.getMetaValue('revision'))).toEqual([
            build.getMetaValue('revision'),
            parentBuild.getMetaValue('revision')
          ]);
        });
    });
  });
});
