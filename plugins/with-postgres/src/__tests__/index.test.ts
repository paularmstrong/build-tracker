/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Pool } from 'pg';
import withPostgres from '../';

jest.mock('pg');

const url = 'https://build-tracker.local';

describe('withPostgres', () => {
  beforeAll(() => {
    // @ts-ignore
    Pool.mockImplementation(() => {
      return {};
    });
  });

  test('preserves user-set config', () => {
    expect(withPostgres({ pg: {}, port: 1234, url })).toMatchObject({ port: 1234 });
  });

  test('adds setup', () => {
    expect(withPostgres({ pg: {}, url })).toHaveProperty('setup');
  });

  test('adds queries', () => {
    expect(withPostgres({ pg: {}, url })).toMatchObject({
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
