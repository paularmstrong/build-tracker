/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Pool } from 'pg';
import setup from '../setup';

jest.mock('pg');

describe('withPostgres', () => {
  let query, release, setupFn;
  beforeEach(() => {
    query = jest.fn();
    release = jest.fn();
    // @ts-ignore
    Pool.mockImplementation(() => ({
      connect: () => ({ query, release }),
    }));

    setupFn = setup(new Pool());
  });

  test('creates the table if not exists', async () => {
    await expect(setupFn()).resolves.toBe(true);
    expect(query).toHaveBeenCalledWith(expect.stringMatching('CREATE TABLE IF NOT EXISTS builds'));
  });

  test('creates a multi-index', async () => {
    await expect(setupFn()).resolves.toBe(true);
    expect(query).toHaveBeenCalledWith(
      'CREATE INDEX IF NOT EXISTS parent ON builds (revision, parentRevision, branch)'
    );
  });

  test('creates an index on timestamp', async () => {
    await expect(setupFn()).resolves.toBe(true);
    expect(query).toHaveBeenCalledWith('CREATE INDEX IF NOT EXISTS timestamp ON builds (timestamp)');
  });

  test('alters the branch column to length 256', async () => {
    await expect(setupFn()).resolves.toBe(true);
    expect(query).toHaveBeenCalledWith('ALTER TABLE builds ALTER COLUMN branch TYPE VARCHAR(256)');
  });

  test('releases the client on complete', async () => {
    await expect(setupFn()).resolves.toBe(true);
    expect(release).toHaveBeenCalled();
  });

  test('releases the client on error', async () => {
    const error = new Error('tacos');
    query.mockReturnValueOnce(Promise.reject(error));
    await expect(setupFn()).rejects.toEqual(error);
    expect(release).toHaveBeenCalled();
  });
});
