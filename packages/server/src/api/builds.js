// @flow
import assert from 'assert';
import type { BT$Build } from '@build-tracker/types';
import BuildComparator from '@build-tracker/comparator';
import { BuildMeta } from '@build-tracker/builds';
import type { $Request, $Response } from 'express';

const isValidBuild = (data: BT$Build): void => {
  assert(data.meta && typeof data.meta === 'object', 'Metadata is provided');
  assert(typeof BuildMeta.getRevision(data) === 'string', 'Build revision is provided');
  assert(typeof BuildMeta.getTimestamp(data) === 'number', 'Build timestamp is provided');
  assert(data.artifacts && typeof data.artifacts === 'object', 'Build artifacts are provided');
  Object.keys(data.artifacts).forEach(key => {
    const artifact = data.artifacts[key];
    assert(artifact.name, `Name is provided for artifact ${key}`);
    assert(artifact.stat, `Stat size is provided for artifact ${key}`);
  });
};

type DateFilter = { startTime: number, endTime: number };
type BranchFilter = { branch?: string, limit?: number };
export type GetBuildsOptions = (DateFilter & BranchFilter) | BranchFilter;

const normalizeQuery = (query: {}): GetBuildsOptions => {
  return Object.keys(query).reduce((memo: GetBuildsOptions, key) => {
    const value = query[key];
    switch (key) {
      case 'startTime':
      case 'endTime':
      case 'limit':
        memo[key] = parseInt(value, 10);
        break;
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
  getByRevisions: (revisions: Array<string>) => Promise<Array<BT$Build>>,
  getBuilds: (options: GetBuildsOptions) => Promise<Array<BT$Build>>
};

export const handleGet = ({ getByRevisions, getBuilds }: BuildGetOptions) => (req: $Request, res: $Response) => {
  const respondWithJSON = data => {
    res.write(JSON.stringify(data));
    res.end();
  };
  if (req.query.revisions) {
    getByRevisions(req.query.revisions).then(respondWithJSON);
  } else {
    const query = normalizeQuery(req.query);
    getBuilds(query).then(respondWithJSON);
  }
};

export type BuildPostOptions = {
  getPrevious: (timestamp: number) => Promise<BT$Build>,
  insert: (build: BT$Build) => Promise<any>
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
    .then(() => getPrevious(BuildMeta.getTimestamp(build)))
    .then((parentBuild: BT$Build) => {
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
