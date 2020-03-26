/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import { Build as BuildStruct } from '@build-tracker/server';
import { Pool } from 'mariadb';
import { NotFoundError, UnimplementedError } from '@build-tracker/api-errors';

export default class Queries {
  private _pool: Pool;

  public constructor(pool: Pool) {
    this._pool = pool;
  }

  public getByRevision = async (revision: string): Promise<BuildStruct> => {
    const rows = await this._pool.query('SELECT meta, artifacts FROM builds WHERE revision = ?', [revision]);
    if (rows.length !== 1) {
      throw new NotFoundError();
    }

    return Promise.resolve(this._formatRow(rows[0]));
  };

  public insert = async ({ meta, artifacts }: BuildStruct): Promise<string> => {
    const build = new Build(meta, artifacts);
    await this._pool.query(
      'INSERT INTO builds (branch, revision, timestamp, parentRevision, meta, artifacts) VALUES (?, ?, ?, ?, ?, ?)',
      [
        build.getMetaValue('branch'),
        build.getMetaValue('revision'),
        build.meta.timestamp,
        build.getMetaValue('parentRevision'),
        JSON.stringify(build.meta),
        JSON.stringify(build.artifacts),
      ]
    );

    return Promise.resolve(build.getMetaValue('revision'));
  };

  public getByRevisions = async (revisions: Array<string>): Promise<Array<BuildStruct>> => {
    const rows = await this._pool.query('SELECT meta, artifacts FROM builds WHERE revision in ?', [revisions]);
    if (!rows.length) {
      throw new NotFoundError();
    }

    return Promise.resolve(rows.map(this._formatRow));
  };

  public getByRevisionRange = async (startRevision: string, endRevision: string): Promise<Array<BuildStruct>> => {
    throw new UnimplementedError(`revision range ${startRevision} - ${endRevision}`);
  };

  public getByTimeRange = async (
    startTimestamp: number,
    endTimestamp: number,
    branch: string
  ): Promise<Array<BuildStruct>> => {
    const rows = await this._pool.query(
      'SELECT meta, artifacts FROM builds WHERE timestamp >= ? AND timestamp <= ? AND branch = ? ORDER BY timestamp',
      [startTimestamp, endTimestamp, branch]
    );
    if (!rows.length) {
      throw new NotFoundError();
    }

    return Promise.resolve(rows.map(this._formatRow));
  };

  public getRecent = async (limit = 20, branch: string): Promise<Array<BuildStruct>> => {
    const rows = await this._pool.query(
      'SELECT meta, artifacts FROM builds WHERE branch = ? ORDER BY timestamp DESC LIMIT ?',
      [branch, limit]
    );

    if (!rows.length) {
      throw new NotFoundError();
    }

    return Promise.resolve(rows.map(this._formatRow).sort((a, b) => a.meta.timestamp - b.meta.timestamp));
  };

  private _formatRow(row: { meta: Buffer; artifacts: Buffer }): BuildStruct {
    return { meta: JSON.parse(row.meta.toString()), artifacts: JSON.parse(row.artifacts.toString()) };
  }
}
