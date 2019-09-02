/**
 * Copyright (c) 2019 Paul Armstrong
 */
import withMysql from '../';

const url = 'https://build-tracker.local';

jest.mock('mysql');

describe('withMysql', () => {
  test('preserves user-set config', () => {
    expect(withMysql({ mysql: {}, port: 1234, url })).toMatchObject({ port: 1234 });
  });

  test('adds setup', () => {
    expect(withMysql({ mysql: {}, url })).toHaveProperty('setup');
  });

  test('adds queries', () => {
    expect(withMysql({ mysql: {}, url })).toMatchObject({
      queries: {
        build: {
          byRevision: expect.any(Function),
          insert: expect.any(Function)
        },
        builds: {
          byRevisions: expect.any(Function),
          byRevisionRange: expect.any(Function),
          byTimeRange: expect.any(Function)
        }
      }
    });
  });
});
