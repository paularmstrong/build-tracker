/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { config } from 'dotenv';
import Queries from './queries';
import { ServerConfig } from '@build-tracker/server/src/server';
import setup from './setup';
import { Pool, PoolConfig } from 'pg';

config();

export default function withPostgres(config: Partial<ServerConfig> & { pg: PoolConfig }): ServerConfig {
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
        byTimeRange: queries.getByTimeRange
      }
    }
  };
}
