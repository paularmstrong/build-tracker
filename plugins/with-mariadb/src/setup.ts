/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Pool } from 'mariadb';

export default function setup(pool: Pool, database: string): () => Promise<boolean> {
  const setup = async (): Promise<boolean> => {
    const client = await pool.getConnection();
    try {
      await client.query(`
CREATE DATABASE IF NOT EXISTS ${database};
USE ${database};
CREATE TABLE IF NOT EXISTS builds(
  revision VARCHAR(64) PRIMARY KEY NOT NULL,
  branch VARCHAR(64) NOT NULL,
  parentRevision VARCHAR(64),
  timestamp INT NOT NULL,
  meta VARCHAR(1024),
  artifacts VARCHAR(1024),
  CHECK (meta IS NULL OR JSON_VALID(meta))
)`);
      await client.query('CREATE INDEX IF NOT EXISTS parent ON builds (revision, parentRevision, branch)');
      await client.query('CREATE INDEX IF NOT EXISTS timestamp ON builds (timestamp)');
    } catch (err) {
      client.release();
      throw err;
    }
    client.release();
    return Promise.resolve(true);
  };
  return setup;
}

module.exports = setup;
