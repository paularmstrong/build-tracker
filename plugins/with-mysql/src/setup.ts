/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Pool } from 'mysql';

export default function setup(pool: Pool): () => Promise<boolean> {
  const setup = (): Promise<boolean> => {
    return new Promise((resolve) => {
      pool.getConnection((err, client) => {
        if (err) {
          client.release();
          throw err;
        }
        client.query(
          `
CREATE TABLE IF NOT EXISTS builds(
  revision VARCHAR(64) PRIMARY KEY NOT NULL,
  branch VARCHAR(256) NOT NULL,
  parentRevision VARCHAR(64),
  timestamp INT NOT NULL,
  meta VARCHAR(1024),
  artifacts BLOB,
  CHECK (meta IS NULL OR JSON_VALID(meta))
)`,
          (err) => {
            if (err) {
              client.release();
              throw err;
            }
            client.query('ALTER TABLE builds ADD INDEX (revision, parentRevision, branch)', (err) => {
              if (err) {
                client.release();
                throw err;
              }
              client.query('ALTER TABLE builds ADD INDEX (timestamp)', (err) => {
                if (err) {
                  client.release();
                  throw err;
                }
                client.query('ALTER TABLE builds MODIFY branch VARCHAR(256)', (err) => {
                  if (err) {
                    client.release();
                    throw err;
                  }
                  client.release();
                  resolve(true);
                });
              });
            });
          }
        );
      });
    });
  };

  return setup;
}

module.exports = setup;
