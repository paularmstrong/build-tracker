/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import { Build as BuildStruct } from '@build-tracker/server/src/types';
import { Pool } from 'mysql';
import { NotFoundError, UnimplementedError } from '@build-tracker/api-errors';

export default class Queries {
  private _pool: Pool;

  public constructor(pool: Pool) {
    this._pool = pool;
  }

  public getByRevision = (revision: string): Promise<BuildStruct> => {
    return new Promise((resolve, reject) => {
      this._pool.query(
        'SELECT meta, artifacts FROM builds WHERE revision = ?',
        [revision],
        (err, results): void => {
          if (err) {
            reject(err);
            return;
          }
          if (results.length !== 1) {
            reject(new NotFoundError());
            return;
          }

          resolve(this._formatRow(results[0]));
        }
      );
    });
  };

  public insert = ({ meta, artifacts }: BuildStruct): Promise<string> => {
    const build = new Build(meta, artifacts);
    return new Promise((resolve, reject) => {
      this._pool.query(
        'INSERT INTO builds (branch, revision, timestamp, parentRevision, meta, artifacts) VALUES (?, ?, ?, ?, ?, ?)',
        [
          build.getMetaValue('branch'),
          build.getMetaValue('revision'),
          build.meta.timestamp,
          build.getMetaValue('parentRevision'),
          JSON.stringify(build.meta),
          JSON.stringify(build.artifacts)
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

  public getByRevisions = (revisions: Array<string>): Promise<Array<BuildStruct>> => {
    return new Promise((resolve, reject) => {
      this._pool.query(
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

          resolve(results.map(this._formatRow));
        }
      );
    });
  };

  public getByRevisionRange = (startRevision: string, endRevision: string): Promise<Array<BuildStruct>> => {
    return new Promise((_resolve, reject) => {
      reject(new UnimplementedError(`revision range ${startRevision} - ${endRevision}`));
    });
  };

  public getByTimeRange = (
    startTimestamp: number,
    endTimestamp: number,
    branch: string
  ): Promise<Array<BuildStruct>> => {
    return new Promise((resolve, reject) => {
      this._pool.query(
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

          resolve(results.map(this._formatRow));
        }
      );
    });
  };

  public getRecent = (limit: number = 20, branch: string): Promise<Array<BuildStruct>> => {
    return new Promise((resolve, reject) => {
      this._pool.query(
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

          resolve(results.map(this._formatRow).sort((a, b) => a.meta.timestamp - b.meta.timestamp));
        }
      );
    });
  };

  private _formatRow(row: { meta: Buffer; artifacts: Buffer }): BuildStruct {
    return { meta: JSON.parse(row.meta.toString()), artifacts: JSON.parse(row.artifacts.toString()) };
  }
}
