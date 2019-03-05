/**
 * Copyright (c) 2019 Paul Armstrong
 */
import bodyParser from 'body-parser';
import Build from '@build-tracker/build';
import Comparator from '@build-tracker/comparator';
import express from 'express';
import { insertBuild } from '../insert';
import request from 'supertest';

const build = new Build({ revision: 'abc', parentRevision: 'def', timestamp: Date.now() }, []);
const parentBuild = new Build({ revision: 'def', parentRevision: '123', timestamp: Date.now() }, []);

describe('insert build handler', () => {
  let getParent, app;
  beforeEach(() => {
    getParent = jest.fn(() => Promise.resolve(parentBuild));
    app = express();
    app.use(bodyParser.json());
  });

  describe('response', () => {
    test('includes the comparator JSON', () => {
      const handler = insertBuild(getParent, { artifacts: {} });
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
      const handler = insertBuild(getParent, { artifacts: {} }, handleInsert);
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
