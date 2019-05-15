/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Pool } from 'pg';
import Queries from '../queries';
import { NotFoundError, UnimplementedError } from '@build-tracker/api-errors';

jest.mock('pg');

describe('withPostgres', () => {
  let query;
  beforeEach(() => {
    query = jest.fn();
    // @ts-ignore
    Pool.mockImplementation(() => ({ query }));
  });

  describe('getByRevision', () => {
    test('selects meta and artifacts', () => {
      const row = { meta: {}, artifacts: [] };
      query.mockReturnValue(Promise.resolve({ rowCount: 1, rows: [row] }));
      const queries = new Queries(new Pool());
      return queries.getByRevision('12345').then(res => {
        expect(query).toHaveBeenCalledWith('SELECT meta, artifacts FROM builds WHERE revision = $1', ['12345']);
        expect(res).toEqual(row);
      });
    });

    test('throws with no results', () => {
      query.mockReturnValue(Promise.resolve({ rowCount: 0 }));
      const queries = new Queries(new Pool());
      return queries.getByRevision('12345').catch(err => {
        expect(err).toBeInstanceOf(NotFoundError);
      });
    });
  });

  describe('insert', () => {
    test('returns the revision on insert', () => {
      const queries = new Queries(new Pool());
      const now = Date.now();
      const build = {
        meta: {
          branch: 'master',
          revision: { value: '12345', url: 'https://build-tracker.local' },
          timestamp: now,
          parentRevision: 'abcdef'
        },
        artifacts: []
      };
      query.mockReturnValue(Promise.resolve({ rowCount: 1, rows: [build] }));
      return queries.insert(build).then(res => {
        expect(query).toHaveBeenCalledWith(
          'INSERT INTO builds (branch, revision, timestamp, parentRevision, meta, artifacts) VALUES ($1, $2, $3, $4, $5, $6)',
          ['master', '12345', now, 'abcdef', JSON.stringify(build.meta), JSON.stringify(build.artifacts)]
        );
        expect(res).toEqual('12345');
      });
    });

    test('rejects if rowCount is not 1', () => {
      const queries = new Queries(new Pool());
      const now = Date.now();
      const build = {
        meta: { branch: 'master', revision: 'abcdef', timestamp: now, parentRevision: '12345' },
        artifacts: []
      };
      query.mockReturnValue(Promise.resolve({ rowCount: 0 }));
      return queries.insert(build).catch(err => {
        expect(err.message).toEqual('Unable to insert build');
      });
    });
  });

  describe('getByRevisions', () => {
    test('selects meta and artifacts', () => {
      const row1 = { meta: { branch: 'master', revision: '12345' }, artifacts: [] };
      const row2 = { meta: { branch: 'master', revision: 'abcde' }, artifacts: [] };
      query.mockReturnValue(Promise.resolve({ rowCount: 2, rows: [row1, row2] }));
      const queries = new Queries(new Pool());
      return queries.getByRevisions('12345', 'abcde').then(res => {
        expect(query).toHaveBeenCalledWith('SELECT meta, artifacts FROM builds WHERE revision in $1', [
          ['12345', 'abcde']
        ]);
        expect(res).toEqual([row1, row2]);
      });
    });

    test('throws with no results', () => {
      query.mockReturnValue(Promise.resolve({ rowCount: 0 }));
      const queries = new Queries(new Pool());
      return queries.getByRevisions('12345', 'abcde').catch(err => {
        expect(err).toBeInstanceOf(NotFoundError);
      });
    });
  });

  describe('getByRevisionRange', () => {
    test('throw unimplemented error', () => {
      const queries = new Queries(new Pool());
      return queries.getByRevisionRange('12345', 'abcde').catch(err => {
        expect(err).toBeInstanceOf(UnimplementedError);
      });
    });
  });

  describe('getByTimeRange', () => {
    test('selects meta and artifacts', () => {
      const row1 = { meta: { branch: 'master', revision: '12345' }, artifacts: [] };
      const row2 = { meta: { branch: 'master', revision: 'abcde' }, artifacts: [] };
      query.mockReturnValue(Promise.resolve({ rowCount: 2, rows: [row1, row2] }));
      const queries = new Queries(new Pool());
      return queries.getByTimeRange(12345, 67890, 'tacos').then(res => {
        expect(query).toHaveBeenCalledWith(
          'SELECT meta, artifacts FROM builds WHERE timestamp >= $1 AND timestamp <= $2 AND branch = $3 ORDER BY timestamp',
          [12345, 67890, 'tacos']
        );
        expect(res).toEqual([row1, row2]);
      });
    });

    test('throws with no results', () => {
      query.mockReturnValue(Promise.resolve({ rowCount: 0 }));
      const queries = new Queries(new Pool());
      return queries.getByTimeRange(12345, 67890, 'tacos').catch(err => {
        expect(err).toBeInstanceOf(NotFoundError);
      });
    });
  });

  describe('getRecent', () => {
    test('returns N most recent', () => {
      const row1 = { meta: { branch: 'master', revision: '12345' }, artifacts: [] };
      const row2 = { meta: { branch: 'master', revision: 'abcde' }, artifacts: [] };
      query.mockReturnValue(Promise.resolve({ rowCount: 2, rows: [row1, row2] }));
      const queries = new Queries(new Pool());
      return queries.getRecent(2, 'master').then(res => {
        expect(query).toHaveBeenCalledWith(
          'SELECT meta, artifacts FROM builds WHERE branch = $1 ORDER BY timestamp LIMIT $2',
          ['master', 2]
        );
        expect(res).toEqual([row1, row2]);
      });
    });

    test('throws with no results', () => {
      query.mockReturnValue(Promise.resolve({ rowCount: 0 }));
      const queries = new Queries(new Pool());
      return queries.getRecent(undefined, 'tacos').catch(err => {
        expect(err).toBeInstanceOf(NotFoundError);
      });
    });
  });
});
