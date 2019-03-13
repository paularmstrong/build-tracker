/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import { Build as BuildStruct } from '@build-tracker/server/src/types';
import { Pool } from 'pg';
import { NotFoundError, UnimplementedError } from '@build-tracker/api-errors';

export default class Queries {
  private _pool: Pool;

  public constructor(pool: Pool) {
    this._pool = pool;
  }

  public getByRevision = async (revision: string): Promise<BuildStruct> => {
    const res = await this._pool.query('SELECT meta, artifacts FROM builds WHERE revision = $1', [revision]);
    if (res.rowCount !== 1) {
      throw new NotFoundError();
    }

    return Promise.resolve(res.rows[0]);
  };

  public insert = async ({ meta, artifacts }: BuildStruct): Promise<string> => {
    const build = new Build(meta, artifacts);
    const res = await this._pool.query(
      'INSERT INTO builds (revision, timestamp, parentRevision, meta, artifacts) VALUES ($1, $2, $3, @4)',
      [
        build.getMetaValue('revision'),
        build.meta.timestamp,
        build.getMetaValue('parentRevision'),
        build.meta,
        build.artifacts
      ]
    );

    if (res.rowCount !== 1) {
      throw new Error('Unable to insert build');
    }

    return Promise.resolve(build.getMetaValue('revision'));
  };

  public getByRevisions = async (...revisions: Array<string>): Promise<Array<BuildStruct>> => {
    const res = await this._pool.query('SELECT meta, artifacts FROM builds WHERE revision in $1', [revisions]);
    if (res.rowCount === 0) {
      throw new NotFoundError();
    }

    return Promise.resolve(res.rows);
  };

  public getByRevisionRange = async (startRevision: string, endRevision: string): Promise<Array<BuildStruct>> => {
    throw new UnimplementedError(`revision range ${startRevision} - ${endRevision}`);
  };

  public getByTimeRange = async (startTimestamp: number, endTimestamp: number): Promise<Array<BuildStruct>> => {
    const res = await this._pool.query(
      'SELECT meta, artifacts FROM builds WHERE  timestamp >= $1 AND timestamp <= $2 ORDER BY timestamp',
      [startTimestamp, endTimestamp]
    );
    if (res.rowCount === 0) {
      throw new NotFoundError();
    }

    return Promise.resolve(res.rows);
  };
}
