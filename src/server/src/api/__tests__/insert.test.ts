import bodyParser from 'body-parser';
import Build from '@build-tracker/build';
import createInsertBuildHandler from '../insert';
import express from 'express';
import request from 'supertest';

const build = new Build({ revision: 'abc', parentRevision: 'def', timestamp: Date.now() }, []);
const parentBuild = new Build({ revision: 'def', parentRevision: '123', timestamp: Date.now() }, []);

describe('insert build handler', () => {
  describe('onInsert', () => {
    test('called with a comparator of the inserted branch against its parentRevision', () => {
      const handleInsert = jest.fn(() => Promise.resolve());
      const getParent = jest.fn(() => Promise.resolve(parentBuild));
      const handler = createInsertBuildHandler(getParent, handleInsert);
      const app = express();
      app.use(bodyParser.json());
      app.post('/test', handler);

      return request(app)
        .post('/test')
        .send({ meta: build.meta, artifacts: build.artifacts })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then(res => {
          const comparator = handleInsert.mock.calls[0][0];
          expect(comparator.builds.map(build => build.getMetaValue('revision'))).toEqual([
            build.getMetaValue('revision'),
            parentBuild.getMetaValue('revision')
          ]);
          expect(res.body).toEqual({ foo: 'bar' });
        });
    });
  });
});
