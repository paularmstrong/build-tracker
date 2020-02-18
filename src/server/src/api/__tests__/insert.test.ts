/**
 * Copyright (c) 2019 Paul Armstrong
 */
import bodyParser from 'body-parser';
import Build from '@build-tracker/build';
import Comparator from '@build-tracker/comparator';
import express from 'express';
import { insertBuild } from '../insert';
import { NotFoundError } from '@build-tracker/api-errors';
import request from 'supertest';

const build = new Build({ branch: 'master', revision: 'abc', parentRevision: 'def', timestamp: Date.now() }, [
  { hash: '123', name: 'tacos', sizes: { stat: 231 } }
]);
const parentBuild = new Build({ branch: 'master', revision: 'def', parentRevision: '123', timestamp: Date.now() }, [
  { hash: '123', name: 'tacos', sizes: { stat: 123 } }
]);

describe('insert build handler', () => {
  let app, config, queries;
  beforeEach(() => {
    queries = {
      byRevision: jest.fn(() => Promise.resolve(parentBuild)),
      insert: jest.fn(() => Promise.resolve('1234'))
    };
    config = {
      artifacts: {},
      queries
    };
    app = express();
    app.use(bodyParser.json());
  });

  describe('insert', () => {
    test('inserts the build', () => {
      const handler = insertBuild(queries, config);
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
    test('returns a JSON serialized Comparator and summary', () => {
      const handler = insertBuild(queries, config);
      app.post('/test', handler);

      const comparator = new Comparator({ builds: [parentBuild, build] });

      return request(app)
        .post('/test')
        .send({ meta: build.meta, artifacts: build.artifacts })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then(res => {
          expect(res.body.comparatorData).toEqual(comparator.serialize());
          expect(res.body.summary).toEqual(comparator.toSummary());
        });
    });
  });

  describe('parent revision', () => {
    describe('onInserted', () => {
      test('called with a comparator of the inserted branch against its parentRevision', () => {
        const handleInsert = jest.fn(() => Promise.resolve());
        const handler = insertBuild(queries, config, handleInsert);
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
              parentBuild.getMetaValue('revision'),
              build.getMetaValue('revision')
            ]);
          });
      });
    });
  });

  describe('no parent revision', () => {
    let app, config, queries;
    beforeEach(() => {
      queries = {
        byRevision: jest.fn(() => Promise.reject(new NotFoundError())),
        insert: jest.fn(() => Promise.resolve('1234'))
      };
      config = {
        artifacts: {},
        queries
      };
      app = express();
      app.use(bodyParser.json());
    });

    describe('insert', () => {
      test('inserts the build', () => {
        const handler = insertBuild(queries, config);
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
      test('returns a JSON serialized Comparator and summary', () => {
        const handler = insertBuild(queries, config);
        app.post('/test', handler);

        const comparator = new Comparator({ builds: [build] });

        return request(app)
          .post('/test')
          .send({ meta: build.meta, artifacts: build.artifacts })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .then(res => {
            expect(res.body.comparatorData).toEqual(comparator.serialize());
            expect(res.body.summary).toEqual(comparator.toSummary());
          });
      });
    });

    describe('onInserted', () => {
      test('called with a comparator of the inserted branch against its parentRevision', () => {
        const handleInsert = jest.fn(() => Promise.resolve());
        const handler = insertBuild(queries, config, handleInsert);
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
              build.getMetaValue('revision')
            ]);
          });
      });
    });
  });
});
