/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Mysql from 'mysql';
import Queries from '../queries';
import { NotFoundError, UnimplementedError } from '@build-tracker/api-errors';

const row1Result = {
  meta: { branch: 'master', revision: '12345', timestamp: 1111 },
  artifacts: []
};
const row2Result = {
  meta: { branch: 'master', revision: 'abcde', timestamp: 2222 },
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

describe('withMysql queries', () => {
  let queries, query;
  beforeEach(() => {
    query = jest.fn((_query, _args, cb) => {
      cb(null, []);
    });
    // @ts-ignore
    jest.spyOn(Mysql, 'createPool').mockImplementation(() => ({ query }));
    queries = new Queries(Mysql.createPool({}));
  });

  describe('getByRevision', () => {
    test('selects meta and artifacts', async () => {
      query.mockImplementation((_query, _args, cb) => {
        cb(null, [row1]);
      });
      await expect(queries.getByRevision('12345')).resolves.toEqual(row1Result);
      expect(query).toHaveBeenCalledWith(
        'SELECT meta, artifacts FROM builds WHERE revision = ?',
        ['12345'],
        expect.any(Function)
      );
    });

    test('throws with no results', async () => {
      await expect(queries.getByRevision('12345')).rejects.toThrow(NotFoundError);
    });
  });

  describe('insert', () => {
    test('returns the revision on insert', async () => {
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
      query.mockImplementation((_query, _args, cb) => {
        cb(null, { insertId: '12345' });
      });
      await expect(queries.insert(build)).resolves.toEqual('12345');
      expect(query).toHaveBeenCalledWith(
        'INSERT INTO builds (branch, revision, timestamp, parentRevision, meta, artifacts) VALUES (?, ?, ?, ?, ?, ?)',
        ['master', '12345', now, 'abcdef', JSON.stringify(build.meta), JSON.stringify(build.artifacts)],
        expect.any(Function)
      );
    });
  });

  describe('getByRevisions', () => {
    test('selects meta and artifacts', async () => {
      query.mockImplementation((_query, _args, cb) => {
        cb(null, [row1, row2]);
      });
      await expect(queries.getByRevisions(['12345', 'abcde'])).resolves.toEqual([row1Result, row2Result]);
      expect(query).toHaveBeenCalledWith(
        'SELECT meta, artifacts FROM builds WHERE revision IN (?)',
        [['12345', 'abcde']],
        expect.any(Function)
      );
    });

    test('throws with no results', async () => {
      await expect(queries.getByRevisions(['12345', 'abcde'])).rejects.toThrow(NotFoundError);
    });
  });

  describe('getByRevisionRange', () => {
    test('throw unimplemented error', async () => {
      await expect(queries.getByRevisionRange('12345', 'abcde')).rejects.toThrow(UnimplementedError);
    });
  });

  describe('getByTimeRange', () => {
    test('selects meta and artifacts', async () => {
      query.mockImplementation((_query, _args, cb) => {
        cb(null, [row1, row2]);
      });
      await expect(queries.getByTimeRange(12345, 67890, 'tacos')).resolves.toEqual([row1Result, row2Result]);
      expect(query).toHaveBeenCalledWith(
        'SELECT meta, artifacts FROM builds WHERE timestamp >= ? AND timestamp <= ? AND branch = ? ORDER BY timestamp',
        [12345, 67890, 'tacos'],
        expect.any(Function)
      );
    });

    test('throws with no results', async () => {
      await expect(queries.getByTimeRange(12345, 67890, 'tacos')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getRecent', () => {
    test('returns N most recent', async () => {
      query.mockImplementation((_query, _args, cb) => {
        cb(null, [row2, row1]);
      });
      await expect(queries.getRecent(2, 'master')).resolves.toEqual([row1Result, row2Result]);
      expect(query).toHaveBeenCalledWith(
        'SELECT meta, artifacts FROM builds WHERE branch = ? ORDER BY timestamp DESC LIMIT ?',
        ['master', 2],
        expect.any(Function)
      );
    });

    test('throws with no results', async () => {
      await expect(queries.getRecent(undefined, 'tacos')).rejects.toThrow(NotFoundError);
    });
  });
});
