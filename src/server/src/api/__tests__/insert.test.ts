/**
 * Copyright (c) 2019 Paul Armstrong
 */
import bodyParser from 'body-parser';
import Build from '@build-tracker/build';
import Comparator from '@build-tracker/comparator';
import express from 'express';
import { insertBuild } from '../insert';
import request from 'supertest';
import { BudgetLevel, BudgetType } from '@build-tracker/types';

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
    test('includes the comparator output in readable formats', () => {
      const handler = insertBuild(queries, config);
      app.post('/test', handler);

      const comparator = new Comparator({ builds: [build, parentBuild] });

      return request(app)
        .post('/test')
        .send({ meta: build.meta, artifacts: build.artifacts })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then(res => {
          expect(res.body).toMatchObject({
            json: comparator.toJSON(),
            markdown: comparator.toMarkdown(),
            csv: comparator.toCsv()
          });
        });
    });

    test('includes the build and parentBuild', () => {
      const handler = insertBuild(queries, config);
      app.post('/test', handler);

      return request(app)
        .post('/test')
        .send({ meta: build.meta, artifacts: build.artifacts })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then(res => {
          expect(res.body).toMatchObject({
            build: build.toJSON(),
            parentBuild: parentBuild.toJSON()
          });
        });
    });

    test('includes groupDeltas', () => {
      const handler = insertBuild(queries, {
        ...config,
        artifacts: {
          groups: [
            {
              name: 'food',
              artifactMatch: /tacos/,
              budgets: [{ type: BudgetType.DELTA, level: BudgetLevel.WARN, maximum: 100 }]
            }
          ]
        }
      });
      app.post('/test', handler);

      return request(app)
        .post('/test')
        .send({ meta: build.meta, artifacts: build.artifacts })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then(res => {
          expect(res.body.groupDeltas).toEqual([
            {
              budgets: [],
              failingBudgets: [],
              hashChanged: false,
              name: 'All',
              percents: { stat: -0.4675324675324675 },
              sizes: { stat: -108 }
            },
            {
              budgets: [{ expected: 100, level: 'warn', passing: false, type: 'delta' }],
              failingBudgets: [{ expected: 100, level: 'warn', passing: false, type: 'delta' }],
              hashChanged: false,
              name: 'food',
              percents: { stat: -0.4675324675324675 },
              sizes: { stat: -108 }
            }
          ]);
        });
    });

    test('includes artifactDeltas', () => {
      const handler = insertBuild(queries, {
        ...config,
        artifacts: {
          budgets: { tacos: [{ type: BudgetType.DELTA, level: BudgetLevel.WARN, maximum: 100 }] }
        }
      });
      app.post('/test', handler);

      return request(app)
        .post('/test')
        .send({ meta: build.meta, artifacts: build.artifacts })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then(res => {
          expect(res.body.artifactDeltas).toEqual([
            {
              budgets: [{ expected: 100, level: 'warn', passing: false, type: 'delta' }],
              failingBudgets: [{ expected: 100, level: 'warn', passing: false, type: 'delta' }],
              hashChanged: false,
              name: 'tacos',
              percents: { stat: -0.4675324675324675 },
              sizes: { stat: -108 }
            }
          ]);
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
            build.getMetaValue('revision'),
            parentBuild.getMetaValue('revision')
          ]);
        });
    });
  });
});
