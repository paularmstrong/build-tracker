/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Mariadb from 'mariadb';
import setup from '../setup';

describe('withMariadb setup', () => {
  let query, release, setupFn;
  beforeEach(() => {
    query = jest.fn();
    release = jest.fn();
    // @ts-ignore
    jest.spyOn(Mariadb, 'createPool').mockImplementation(() => ({
      // @ts-ignore
      getConnection: () => Promise.resolve({ query, release }),
    }));

    setupFn = setup(Mariadb.createPool({}));
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

  test('releases the client on complete', async () => {
    await expect(setupFn()).resolves.toBe(true);
    expect(release).toHaveBeenCalled();
  });

  test('releases the client on error', async () => {
    const error = new Error('tacos');
    query.mockReturnValueOnce(Promise.reject(error));
    await expect(setupFn()).rejects.toThrow(error);
    expect(release).toHaveBeenCalled();
  });
});
