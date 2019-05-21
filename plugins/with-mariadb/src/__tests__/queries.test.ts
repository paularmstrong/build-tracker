/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Mariadb from 'mariadb';
import Queries from '../queries';
import { NotFoundError, UnimplementedError } from '@build-tracker/api-errors';

const row1Result = {
  meta: { branch: 'master', revision: '12345' },
  artifacts: []
};
const row2Result = {
  meta: { branch: 'master', revision: 'abcde' },
  artifacts: []
};
const row1 = {
  meta: Buffer.from(JSON.stringify(row1Result.meta)),
  artifacts: Buffer.from(JSON.stringify(row1Result.artifacts))
};
const row2 = {
  meta: Buffer.from(JSON.stringify(row2Result.meta)),
  artifacts: Buffer.from(JSON.stringify(row2Result.artifacts))
};

describe('withMariadb queries', () => {
  let query;
  beforeEach(() => {
    query = jest.fn();
    // @ts-ignore
    jest.spyOn(Mariadb, 'createPool').mockImplementation(() => ({ query }));
  });

  describe('getByRevision', () => {
    test('selects meta and artifacts', () => {
      query.mockReturnValue(Promise.resolve([row1]));
      const queries = new Queries(Mariadb.createPool({}));
      return queries.getByRevision('12345').then(res => {
        expect(query).toHaveBeenCalledWith('SELECT meta, artifacts FROM builds WHERE revision = ?', ['12345']);
        expect(res).toEqual(row1Result);
      });
    });

    test('throws with no results', () => {
      query.mockReturnValue(Promise.resolve([]));
      const queries = new Queries(Mariadb.createPool({}));
      return queries.getByRevision('12345').catch(err => {
        expect(err).toBeInstanceOf(NotFoundError);
      });
    });
  });

  describe('insert', () => {
    test('returns the revision on insert', () => {
      const queries = new Queries(Mariadb.createPool({}));
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
      query.mockReturnValue(Promise.resolve(row1));
      return queries.insert(build).then(res => {
        expect(query).toHaveBeenCalledWith(
          'INSERT INTO builds (branch, revision, timestamp, parentRevision, meta, artifacts) VALUES (?, ?, ?, ?, ?, ?)',
          ['master', '12345', now, 'abcdef', build.meta, build.artifacts]
        );
        expect(res).toEqual('12345');
      });
    });

    test('rejects if rowCount is not 1', () => {
      const queries = new Queries(Mariadb.createPool({}));
      const now = Date.now();
      const build = {
        meta: { branch: 'master', revision: 'abcdef', timestamp: now, parentRevision: '12345' },
        artifacts: []
      };
      query.mockReturnValue(Promise.resolve([]));
      return queries.insert(build).catch(err => {
        expect(err.message).toEqual('Unable to insert build');
      });
    });
  });

  describe('getByRevisions', () => {
    test('selects meta and artifacts', () => {
      query.mockReturnValue(Promise.resolve([row1, row2]));
      const queries = new Queries(Mariadb.createPool({}));
      return queries.getByRevisions('12345', 'abcde').then(res => {
        expect(query).toHaveBeenCalledWith('SELECT meta, artifacts FROM builds WHERE revision in ?', [
          ['12345', 'abcde']
        ]);
        expect(res).toEqual([row1Result, row2Result]);
      });
    });

    test('throws with no results', () => {
      query.mockReturnValue(Promise.resolve([]));
      const queries = new Queries(Mariadb.createPool({}));
      return queries.getByRevisions('12345', 'abcde').catch(err => {
        expect(err).toBeInstanceOf(NotFoundError);
      });
    });
  });

  describe('getByRevisionRange', () => {
    test('throw unimplemented error', () => {
      const queries = new Queries(Mariadb.createPool({}));
      return queries.getByRevisionRange('12345', 'abcde').catch(err => {
        expect(err).toBeInstanceOf(UnimplementedError);
      });
    });
  });

  describe('getByTimeRange', () => {
    test('selects meta and artifacts', () => {
      query.mockReturnValue(Promise.resolve([row1, row2]));
      const queries = new Queries(Mariadb.createPool({}));
      return queries.getByTimeRange(12345, 67890, 'tacos').then(res => {
        expect(query).toHaveBeenCalledWith(
          'SELECT meta, artifacts FROM builds WHERE timestamp >= ? AND timestamp <= ? AND branch = ? ORDER BY timestamp',
          [12345, 67890, 'tacos']
        );
        expect(res).toEqual([row1Result, row2Result]);
      });
    });

    test('throws with no results', () => {
      query.mockReturnValue(Promise.resolve([]));
      const queries = new Queries(Mariadb.createPool({}));
      return queries.getByTimeRange(12345, 67890, 'tacos').catch(err => {
        expect(err).toBeInstanceOf(NotFoundError);
      });
    });
  });

  describe('getRecent', () => {
    test('returns N most recent', () => {
      query.mockReturnValue(Promise.resolve([row1, row2]));
      const queries = new Queries(Mariadb.createPool({}));
      return queries.getRecent(2, 'master').then(res => {
        expect(query).toHaveBeenCalledWith(
          'SELECT meta, artifacts FROM builds WHERE branch = ? ORDER BY timestamp LIMIT ?',
          ['master', 2]
        );
        expect(res).toEqual([row1Result, row2Result]);
      });
    });

    test('throws with no results', () => {
      query.mockReturnValue(Promise.resolve([]));
      const queries = new Queries(Mariadb.createPool({}));
      return queries.getRecent(undefined, 'tacos').catch(err => {
        expect(err).toBeInstanceOf(NotFoundError);
      });
    });
  });
});
