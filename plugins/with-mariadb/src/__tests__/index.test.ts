/**
 * Copyright (c) 2019 Paul Armstrong
 */
import withMariadb from '../';

const url = 'https://build-tracker.local';

jest.mock('mariadb');

describe('withMariadb', () => {
  test('preserves user-set config', () => {
    expect(withMariadb({ mariadb: {}, port: 1234, url })).toMatchObject({ port: 1234 });
  });

  test('adds setup', () => {
    expect(withMariadb({ mariadb: {}, url })).toHaveProperty('setup');
  });

  test('adds queries', () => {
    expect(withMariadb({ mariadb: {}, url })).toMatchObject({
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
