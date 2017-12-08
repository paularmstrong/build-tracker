// @flow
import assert from 'assert';
import type { $Request, $Response } from 'express';
import BuildComparator from 'build-tracker-comparator';
import type { Build } from 'build-tracker-flowtypes';

const isValidBuild = (data): void => {
  assert(data.meta && typeof data.meta === 'object', 'Metadata is provided');
  assert(data.meta.revision && typeof data.meta.revision === 'string', 'Build revision is provided');
  assert(data.meta.timestamp && typeof data.meta.timestamp === 'number', 'Build timestamp is provided');
  assert(data.artifacts && typeof data.artifacts === 'object', 'Build artifacts are provided');
  Object.keys(data.artifacts).forEach(key => {
    const artifact = data.artifacts[key];
    assert(artifact.name, `Name is provided for artifact ${key}`);
    assert(artifact.stat, `Stat size is provided for artifact ${key}`);
  });
};

type NormalizedQuery = {
  branch?: string,
  count?: number,
  endRevision?: string,
  endTime?: number,
  revisions?: Array<string>,
  startRevision?: string,
  startTime?: number
};

const normalizeQuery = (query: {}): NormalizedQuery => {
  return Object.keys(query).reduce((memo: NormalizedQuery, key) => {
    const value = query[key];
    switch (key) {
      case 'startTime':
      case 'endTime':
      case 'count':
        memo[key] = parseInt(value, 10);
        break;
      case 'startRevision':
      case 'endRevision':
      case 'branch':
        memo[key] = `${value}`;
        break;
      default:
        memo[key] = value;
    }
    return memo;
  }, {});
};

export type BuildGetOptions = {
  getByBranch: (branch?: string, limit?: number) => Promise<Array<Build>>,
  getByRevisionRange: (startRevision: string, endRevision?: string) => Promise<Array<Build>>,
  getByRevisions: (revisions: Array<string>) => Promise<Array<Build>>,
  getByTimeRange: (startTime: number, endTime?: number) => Promise<Array<Build>>
};

export const handleGet = ({ getByRevisionRange, getByTimeRange, getByRevisions, getByBranch }: BuildGetOptions) => (
  req: $Request,
  res: $Response
) => {
  const query = normalizeQuery(req.query);
  const respondWithJSON = data => {
    res.write(JSON.stringify(data));
    res.end();
  };
  if (query.revisions) {
    getByRevisions(query.revisions).then(respondWithJSON);
  } else if (query.startRevision) {
    getByRevisionRange(query.startRevision, query.endRevision).then(respondWithJSON);
  } else if (query.startTime) {
    getByTimeRange(query.startTime, query.endTime).then(respondWithJSON);
  } else {
    getByBranch(query.branch || 'master', query.count).then(respondWithJSON);
  }
};

export type BuildPostOptions = {
  getPrevious: (timestamp: number) => Promise<Build>,
  insert: (build: Build) => Promise<any>
};

export type BuildPostCallbacks = {
  onBuildInserted?: (comparator: BuildComparator) => void
};

export const handlePost = ({ getPrevious, insert }: BuildPostOptions, { onBuildInserted }: BuildPostCallbacks = {}) => (
  req: $Request,
  res: $Response
) => {
  const build = req.body;
  try {
    isValidBuild(build);
  } catch (err) {
    res.status(400);
    res.write(JSON.stringify({ success: false, error: err.toString(), build }));
    res.end();
    return;
  }

  insert(build)
    .then(() => {
      res.write(JSON.stringify({ success: true }));
    })
    .then(() => getPrevious(build.meta.timestamp))
    .then((parentBuild: Build) => {
      const comparator = new BuildComparator([parentBuild, build].filter(Boolean));
      onBuildInserted && onBuildInserted(comparator);
    })
    .then(() => {
      res.end();
    })
    .catch(err => {
      res.status(400);
      res.write(JSON.stringify({ success: false, error: err.toString() }));
      res.end();
    });
};
