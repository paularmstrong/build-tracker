/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { config } from 'dotenv';
import Queries from './queries';
import { ServerConfig } from '@build-tracker/server';
import setup from './setup';
import { createPool, PoolConfig } from 'mariadb';

config();
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export default function withMariadb(config: Omit<ServerConfig, 'queries'> & { mariadb: PoolConfig }): ServerConfig {
  const { mariadb: mariaConfig } = config;
  const database = mariaConfig.database || process.env.MARIADATABASE || 'buildtracker';

  const pool = createPool({
    user: process.env.MARIAUSER,
    host: process.env.MARIAHOST,
    password: process.env.MARIAPASSWORD,
    port: process.env.MARIAPORT ? parseInt(process.env.MARIAPORT, 10) : 3306,
    ...mariaConfig,
    database
  });

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
