/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Pool } from 'mariadb';

export default function setup(pool: Pool): () => Promise<boolean> {
  return async function setup(): Promise<boolean> {
    const client = await pool.getConnection();
    try {
      await client.query(`
CREATE TABLE IF NOT EXISTS builds(
  revision VARCHAR(64) PRIMARY KEY NOT NULL,
  branch VARCHAR(256) NOT NULL,
  parentRevision VARCHAR(64),
  timestamp INT NOT NULL,
  meta VARCHAR(1024),
  artifacts BLOB,
  CHECK (meta IS NULL OR JSON_VALID(meta))
)`);
      await client.query('CREATE INDEX IF NOT EXISTS parent ON builds (revision, parentRevision, branch)');
      await client.query('CREATE INDEX IF NOT EXISTS timestamp ON builds (timestamp)');
      await client.query('ALTER TABLE builds MODIFY branch VARCHAR(256)');
    } catch (err) {
      client.release();
      throw err;
    }
    client.release();
    return Promise.resolve(true);
  };
}
