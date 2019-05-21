/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import { Build as BuildStruct } from '@build-tracker/server/src/types';
import { Pool } from 'mariadb';
import { NotFoundError, UnimplementedError } from '@build-tracker/api-errors';

export default class Queries {
  private _pool: Pool;

  public constructor(pool: Pool) {
    this._pool = pool;
  }

  public getByRevision = async (revision: string): Promise<BuildStruct> => {
    const res = await this._pool.query('SELECT meta, artifacts FROM builds WHERE revision = ?', [revision]);
    if (res.rowCount !== 1) {
      throw new NotFoundError();
    }

    return Promise.resolve(res.rows[0]);
  };

  public insert = async ({ meta, artifacts }: BuildStruct): Promise<string> => {
    const build = new Build(meta, artifacts);
    const res = await this._pool.query(
      'INSERT INTO builds (branch, revision, timestamp, parentRevision, meta, artifacts) VALUES (?, ?, ?, ?, ?, ?)',
      [
        build.getMetaValue('branch'),
        build.getMetaValue('revision'),
        build.meta.timestamp,
        build.getMetaValue('parentRevision'),
        JSON.stringify(build.meta),
        JSON.stringify(build.artifacts)
      ]
    );

    if (res.rowCount !== 1) {
      throw new Error('Unable to insert build');
    }

    return Promise.resolve(build.getMetaValue('revision'));
  };

  public getByRevisions = async (...revisions: Array<string>): Promise<Array<BuildStruct>> => {
    const res = await this._pool.query('SELECT meta, artifacts FROM builds WHERE revision in ?', [revisions]);
    if (res.rowCount === 0) {
      throw new NotFoundError();
    }

    return Promise.resolve(res.rows);
  };

  public getByRevisionRange = async (startRevision: string, endRevision: string): Promise<Array<BuildStruct>> => {
    throw new UnimplementedError(`revision range ${startRevision} - ${endRevision}`);
  };

  public getByTimeRange = async (
    startTimestamp: number,
    endTimestamp: number,
    branch: string
  ): Promise<Array<BuildStruct>> => {
    const res = await this._pool.query(
      'SELECT meta, artifacts FROM builds WHERE timestamp >= ? AND timestamp <= ? AND branch = ? ORDER BY timestamp',
      [startTimestamp, endTimestamp, branch]
    );
    if (res.rowCount === 0) {
      throw new NotFoundError();
    }

    return Promise.resolve(res.rows);
  };

  public getRecent = async (limit: number = 20, branch: string): Promise<Array<BuildStruct>> => {
    const res = await this._pool.query(
      'SELECT meta, artifacts FROM builds WHERE branch = ? ORDER BY timestamp LIMIT ?',
      [branch, limit]
    );
    if (res.rowCount === 0) {
      throw new NotFoundError();
    }

    return Promise.resolve(res.rows);
  };
}
