/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Pool } from 'pg';
import Queries from './queries';
import { ServerConfig } from '@build-tracker/server/src/server';

interface PostgresConfig {
  user?: string;
  host?: string;
  database?: string;
  password?: string;
  port?: number;
}

export default function withPostgres(config: Partial<ServerConfig> & { pg: PostgresConfig }): ServerConfig {
  const { pg: pgConfig } = config;

  const pool = new Pool(pgConfig);
  const queries = new Queries(pool);

  return {
    ...config,
    queries: {
      build: {
        byRevision: queries.getyByRevision,
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
