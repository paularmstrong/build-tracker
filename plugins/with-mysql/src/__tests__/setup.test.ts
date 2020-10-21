/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Mysql from 'mysql';
import setup from '../setup';

describe('withMysql setup', () => {
  let query, release, setupFn;
  beforeEach(() => {
    query = jest.fn((_query, cb) => {
      cb(null);
    });
    release = jest.fn();
    // @ts-ignore
    jest.spyOn(Mysql, 'createPool').mockImplementation(() => ({
      getConnection: (cb) => {
        // @ts-ignore
        cb(null, { query, release });
      },
    }));

    setupFn = setup(Mysql.createPool({}));
  });

  test('creates the table if not exists', async () => {
    await expect(setupFn()).resolves.toBe(true);
    expect(query).toHaveBeenCalledWith(
      expect.stringMatching('CREATE TABLE IF NOT EXISTS builds'),
      expect.any(Function)
    );
  });

  test('creates a multi-index', async () => {
    await expect(setupFn()).resolves.toBe(true);
    expect(query).toHaveBeenCalledWith(
      'ALTER TABLE builds ADD INDEX (revision, parentRevision, branch)',
      expect.any(Function)
    );
  });

  test('creates an index on timestamp', async () => {
    await expect(setupFn()).resolves.toBe(true);
    expect(query).toHaveBeenCalledWith('ALTER TABLE builds ADD INDEX (timestamp)', expect.any(Function));
  });

  test('alters the branch column to length 256', async () => {
    await expect(setupFn()).resolves.toBe(true);
    expect(query).toHaveBeenCalledWith('ALTER TABLE builds MODIFY branch VARCHAR(256)', expect.any(Function));
  });

  test('releases the client on complete', async () => {
    await expect(setupFn()).resolves.toBe(true);
    expect(release).toHaveBeenCalled();
  });

  test('releases the client on error', async () => {
    const error = new Error('tacos');
    query.mockImplementationOnce((_query, cb) => {
      cb(error);
    });
    await expect(setupFn()).rejects.toThrow(error);
    expect(release).toHaveBeenCalled();
  });
});
