/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { config } from 'dotenv';
import Queries from './queries';
import { ServerConfig } from '@build-tracker/server/src/server';
import setup from './setup';
import { Pool, PoolConfig } from 'pg';

config();

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export default function withPostgres(config: Omit<ServerConfig, 'queries'> & { pg: PoolConfig }): ServerConfig {
  const { pg: pgConfig } = config;

  const pool = new Pool(pgConfig);

  const queries = new Queries(pool);

  return {
    ...config,
    setup: setup(pool),
    queries: {
      build: {
        byRevision: queries.getByRevision,
        insert: queries.insert
      },
      builds: {
        byRevisions: queries.getByRevisions,
        byRevisionRange: queries.getByRevisionRange,
        byTimeRange: queries.getByTimeRange,
        recent: queries.getRecent
      }
    }
  };
}
