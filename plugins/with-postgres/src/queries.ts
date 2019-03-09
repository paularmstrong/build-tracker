/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import { Build as BuildStruct } from '@build-tracker/server/src/types';
import { Pool } from 'pg';

export default class Queries {
  private _pool: Pool;

  public constructor(pool: Pool) {
    this._pool = pool;
  }

  public async getyByRevision(revision: string): Promise<BuildStruct> {
    const client = await this._pool.connect();
    const res = await client.query('SELECT meta, artifacts FROM builds WHERE revision = $1', [revision]);
    if (res.rowCount !== 1) {
      throw new Error('No result found');
    }

    return Promise.resolve(res.rows[0]);
  }

  public async insert({ meta, artifacts }: BuildStruct): Promise<string> {
    const build = new Build(meta, artifacts);
    const client = await this._pool.connect();
    const res = await client.query(
      'INSERT INTO builds (revision, timestamp, parentRevision, meta, artifacts) VALUES ($1, $2, $3, @4)',
      [
        build.getMetaValue('revision'),
        build.timestamp,
        build.getMetaValue('parentRevision'),
        build.meta,
        build.artifacts
      ]
    );

    if (res.rowCount !== 1) {
      throw new Error('No result found');
    }

    return Promise.resolve(build.getMetaValue('revision'));
  }

  public async getByRevisions(...revisions: Array<string>): Promise<Array<BuildStruct>> {
    const client = await this._pool.connect();
    const res = await client.query('SELECT meta, artifacts FROM builds WHERE revision in $1', [revisions]);
    if (res.rowCount === 0) {
      throw new Error('No result found');
    }

    return Promise.resolve(res.rows);
  }

  public async getByRevisionRange(startRevision: string, endRevision: string): Promise<Array<BuildStruct>> {
    throw new Error(`unimplemented ${startRevision} - ${endRevision}`);
  }

  public async getByTimeRange(startTimestamp: number, endTimestamp: number): Promise<Array<BuildStruct>> {
    const client = await this._pool.connect();
    const res = await client.query(
      'SELECT meta, artifacts FROM builds WHERE  timestamp >= $1 AND timestamp <= $2 ORDER BY timestamp',
      [startTimestamp, endTimestamp]
    );
    if (res.rowCount === 0) {
      throw new Error('No result found');
    }

    return Promise.resolve(res.rows);
  }
}
