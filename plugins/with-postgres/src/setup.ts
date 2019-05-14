/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Pool } from 'pg';

export default function setup(pool: Pool): () => Promise<boolean> {
  const setup = async (): Promise<boolean> => {
    const client = await pool.connect();
    try {
      await client.query(`CREATE TABLE IF NOT EXISTS builds(
  revision char(64) PRIMARY KEY NOT NULL,
  branch char(64) NOT NULL,
  parentRevision char(64),
  timestamp int NOT NULL,
  meta jsonb NOT NULL,
  artifacts jsonb NOT NULL
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
