/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import { Build as BuildStruct } from '@build-tracker/server';
import { Pool } from 'mysql';
import { NotFoundError, UnimplementedError } from '@build-tracker/api-errors';

export default class Queries {
  #pool: Pool;

  constructor(pool: Pool) {
    this.#pool = pool;
  }

  getByRevision = (revision: string): Promise<BuildStruct> => {
    return new Promise((resolve, reject) => {
      this.#pool.query('SELECT meta, artifacts FROM builds WHERE revision = ?', [revision], (err, results): void => {
        if (err) {
          reject(err);
          return;
        }
        if (results.length !== 1) {
          reject(new NotFoundError());
          return;
        }

        resolve(this.#formatRow(results[0]));
      });
    });
  };

  insert = ({ meta, artifacts }: BuildStruct): Promise<string> => {
    const build = new Build(meta, artifacts);
    return new Promise((resolve, reject) => {
      this.#pool.query(
        'INSERT INTO builds (branch, revision, timestamp, parentRevision, meta, artifacts) VALUES (?, ?, ?, ?, ?, ?)',
        [
          build.getMetaValue('branch'),
          build.getMetaValue('revision'),
          build.meta.timestamp,
          build.getMetaValue('parentRevision'),
          JSON.stringify(build.meta),
          JSON.stringify(build.artifacts),
        ],
        (err, results): void => {
          if (err) {
            reject(err);
            return;
          }

          resolve(results.insertId);
        }
      );
    });
  };

  getByRevisions = (revisions: Array<string>): Promise<Array<BuildStruct>> => {
    return new Promise((resolve, reject) => {
      this.#pool.query(
        'SELECT meta, artifacts FROM builds WHERE revision IN (?)',
        [revisions],
        (err, results): void => {
          if (err) {
            reject(err);
            return;
          }

          if (!results.length) {
            reject(new NotFoundError());
            return;
          }

          resolve(results.map(this.#formatRow));
        }
      );
    });
  };

  getByRevisionRange = (startRevision: string, endRevision: string): Promise<Array<BuildStruct>> => {
    return new Promise((_resolve, reject) => {
      reject(new UnimplementedError(`revision range ${startRevision} - ${endRevision}`));
    });
  };

  getByTimeRange = (startTimestamp: number, endTimestamp: number, branch: string): Promise<Array<BuildStruct>> => {
    return new Promise((resolve, reject) => {
      this.#pool.query(
        'SELECT meta, artifacts FROM builds WHERE timestamp >= ? AND timestamp <= ? AND branch = ? ORDER BY timestamp',
        [startTimestamp, endTimestamp, branch],
        (err, results): void => {
          if (err) {
            reject(err);
            return;
          }

          if (!results.length) {
            reject(new NotFoundError());
            return;
          }

          resolve(results.map(this.#formatRow));
        }
      );
    });
  };

  getRecent = (limit = 20, branch: string): Promise<Array<BuildStruct>> => {
    return new Promise((resolve, reject) => {
      this.#pool.query(
        'SELECT meta, artifacts FROM builds WHERE branch = ? ORDER BY timestamp DESC LIMIT ?',
        [branch, limit],
        (err, results): void => {
          if (err) {
            reject(err);
            return;
          }

          if (!results.length) {
            reject(new NotFoundError());
            return;
          }

          resolve(results.map(this.#formatRow).sort((a, b) => a.meta.timestamp - b.meta.timestamp));
        }
      );
    });
  };

  #formatRow(row: { meta: Buffer; artifacts: Buffer }): BuildStruct {
    return { meta: JSON.parse(row.meta.toString()), artifacts: JSON.parse(row.artifacts.toString()) };
  }
}
