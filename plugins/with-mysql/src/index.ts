/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { config } from 'dotenv';
import Queries from './queries';
import { ServerConfig } from '@build-tracker/server';
import setup from './setup';
import { createPool, PoolConfig } from 'mysql';

config();
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export default function withMysql(config: Omit<ServerConfig, 'queries'> & { mysql: PoolConfig }): ServerConfig {
  const { mysql: mysqlConfig } = config;
  const database = mysqlConfig.database || process.env.MYSQLDATABASE || 'buildtracker';

  const pool = createPool({
    user: process.env.MYSQLUSER,
    host: process.env.MYSQLHOST,
    password: process.env.MYSQLPASSWORD,
    port: process.env.MYSQLPORT ? parseInt(process.env.MYSQLPORT, 10) : 3306,
    ...mysqlConfig,
    database,
  });

  const queries = new Queries(pool);

  return {
    ...config,
    setup: setup(pool),
    queries: {
      build: {
        byRevision: queries.getByRevision,
        insert: queries.insert,
      },
      builds: {
        byRevisions: queries.getByRevisions,
        byRevisionRange: queries.getByRevisionRange,
        byTimeRange: queries.getByTimeRange,
        recent: queries.getRecent,
      },
    },
  };
}
