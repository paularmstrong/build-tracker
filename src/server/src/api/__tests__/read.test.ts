/**
 * Copyright (c) 2019 Paul Armstrong
 */
import express from 'express';
import middleware from '../';
import request from 'supertest';

describe('read', () => {
  let build, config, queries;
  beforeEach(() => {
    build = { meta: { revision: '123', parentRevision: '456', timestamp: Date.now() }, artifacts: [] };
    queries = {
      build: {
        byRevision: jest.fn(() => Promise.resolve(build))
      },
      builds: {
        byRevisions: jest.fn(() => Promise.resolve([build])),
        byRevisionRange: jest.fn(() => Promise.resolve([build])),
        byTimeRange: jest.fn(() => Promise.resolve([build])),
        recent: jest.fn(() => Promise.resolve([build]))
      }
    };

    config = {
      queries
    };
  });

  describe('queryByRevision', () => {
    test('queries by revision', () => {
      const app = express();
      app.use(middleware(express.Router(), config, {}));

      return request(app)
        .get('/api/build/1234567890')
        .then(res => {
          expect(queries.build.byRevision).toHaveBeenCalledWith('1234567890');
          expect(res.body).toEqual(build);
        });
    });

    test('throws 500 on failure', () => {
      queries.build.byRevision.mockImplementation(() => Promise.reject('tacos'));
      const app = express();
      app.use(middleware(express.Router(), config, {}));

      return request(app)
        .get('/api/build/1234567890')
        .catch(res => {
          expect(res.status).toBe(500);
        });
    });
  });

  describe('queryByRevisionRange', () => {
    test('queries by revision range', () => {
      const app = express();
      app.use(middleware(express.Router(), config, {}));

      return request(app)
        .get('/api/builds/range/1234567..abcdef')
        .then(res => {
          expect(queries.builds.byRevisionRange).toHaveBeenCalledWith('1234567', 'abcdef');
          expect(res.body).toEqual([build]);
        });
    });

    test('throws 500 on failure', () => {
      queries.builds.byRevisionRange.mockImplementation(() => Promise.reject('tacos'));
      const app = express();
      app.use(middleware(express.Router(), config, {}));

      return request(app)
        .get('/api/builds/range/1234567..abcdef')
        .catch(res => {
          expect(res.status).toBe(500);
        });
    });
  });

  describe('queryByTimeRange', () => {
    test('queries by time range', () => {
      const app = express();
      app.use(middleware(express.Router(), config, {}));

      return request(app)
        .get('/api/builds/time/1234567..2345678')
        .then(res => {
          expect(queries.builds.byTimeRange).toHaveBeenCalledWith(1234567, 2345678, 'master');
          expect(res.body).toEqual([build]);
        });
    });

    test('can use query param for branch', () => {
      const app = express();
      app.use(middleware(express.Router(), config, {}));

      return request(app)
        .get('/api/builds/time/1234567..2345678?branch=tacos')
        .then(res => {
          expect(queries.builds.byTimeRange).toHaveBeenCalledWith(1234567, 2345678, 'tacos');
          expect(res.body).toEqual([build]);
        });
    });

    test('can use app config for default branch', () => {
      const app = express();
      app.use(middleware(express.Router(), { ...config, defaultBranch: 'burritos' }, {}));

      return request(app)
        .get('/api/builds/time/1234567..2345678')
        .then(res => {
          expect(queries.builds.byTimeRange).toHaveBeenCalledWith(1234567, 2345678, 'burritos');
          expect(res.body).toEqual([build]);
        });
    });

    test('throws 500 on failure', () => {
      queries.builds.byTimeRange.mockImplementation(() => Promise.reject('tacos'));
      const app = express();
      app.use(middleware(express.Router(), config, {}));

      return request(app)
        .get('/api/builds/time/1234567..2345678')
        .catch(res => {
          expect(res.status).toBe(500);
        });
    });
  });

  describe('queryByRevisions', () => {
    test('queries by revision range', () => {
      const app = express();
      app.use(middleware(express.Router(), config, {}));

      return request(app)
        .get('/api/builds/list/1234567/abcdef/239587')
        .then(res => {
          expect(queries.builds.byRevisions).toHaveBeenCalledWith(['1234567', 'abcdef', '239587']);
          expect(res.body).toEqual([build]);
        });
    });

    test('throws 500 on failure', () => {
      queries.builds.byRevisions.mockImplementation(() => Promise.reject('tacos'));
      const app = express();
      app.use(middleware(express.Router(), config, {}));

      return request(app)
        .get('/api/builds/list/1234567/abcdef/239587')
        .catch(res => {
          expect(res.status).toBe(500);
        });
    });
  });

  describe('queryByRecent', () => {
    test('queries recent revisions', () => {
      const app = express();
      app.use(middleware(express.Router(), config, {}));

      return request(app)
        .get('/api/builds')
        .then(res => {
          expect(queries.builds.recent).toHaveBeenCalledWith(undefined, 'master');
          expect(res.body).toEqual([build]);
        });
    });

    test('queries recent revisions with limit', () => {
      const app = express();
      app.use(middleware(express.Router(), config, {}));

      return request(app)
        .get('/api/builds/4')
        .then(res => {
          expect(queries.builds.recent).toHaveBeenCalledWith(4, 'master');
          expect(res.body).toEqual([build]);
        });
    });

    test('queries recent revisions with query param for branch', () => {
      const app = express();
      app.use(middleware(express.Router(), config, {}));

      return request(app)
        .get('/api/builds/2?branch=tacos')
        .then(res => {
          expect(queries.builds.recent).toHaveBeenCalledWith(2, 'tacos');
          expect(res.body).toEqual([build]);
        });
    });

    test('queries recent revisions with app config defaultBranch', () => {
      const app = express();
      app.use(middleware(express.Router(), { ...config, defaultBranch: 'burritos' }, {}));

      return request(app)
        .get('/api/builds/10')
        .then(res => {
          expect(queries.builds.recent).toHaveBeenCalledWith(10, 'burritos');
          expect(res.body).toEqual([build]);
        });
    });

    test('throws 500 on failure', () => {
      queries.builds.recent.mockImplementation(() => Promise.reject('tacos'));
      const app = express();
      app.use(middleware(express.Router(), config, {}));

      return request(app)
        .get('/api/builds')
        .catch(res => {
          expect(res.status).toBe(500);
        });
    });
  });
});
