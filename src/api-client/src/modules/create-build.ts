/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Git from './git';
import { Config } from './config';
import pathToRegexp from 'path-to-regexp';
import statArtifacts from './stat-artifacts';
import { Artifact, BuildMeta, BuildMetaItem } from '@build-tracker/build';

export interface Options {
  branch?: string;
  meta?: {};
  parentRevision?: string;
  skipDirtyCheck: boolean;
}

export interface Build {
  meta: BuildMeta;
  artifacts: Array<Artifact>;
}

export default async function createBuild(config: Config, opts: Options = { skipDirtyCheck: false }): Promise<Build> {
  if (!opts.skipDirtyCheck) {
    const isDirty = await Git.isDirty(config.cwd);
    if (isDirty) {
      throw new Error('Current work tree is dirty. Please commit all changes before proceeding');
    }
  }

  const artifactStats = statArtifacts(config);
  const artifacts = Array.from(artifactStats).reduce((memo, [artifactName, stat]) => {
    memo.push({
      name: artifactName,
      hash: stat.hash,
      sizes: {
        stat: stat.stat,
        gzip: stat.gzip,
        brotli: stat.brotli,
      },
    });
    return memo;
  }, []);

  const defaultBranch = await Git.getDefaultBranch(config.cwd);
  const branch = opts.branch ? opts.branch : await Git.getBranch(config.cwd);
  let revision: BuildMetaItem = await Git.getCurrentRevision(config.cwd);
  let parentRevision: BuildMetaItem =
    opts.parentRevision ||
    (branch !== defaultBranch
      ? await Git.getMergeBase(defaultBranch, config.cwd)
      : await Git.getParentRevision(revision));
  const { timestamp, name, subject } = await Git.getRevisionDetails(revision, config.cwd);

  if (config.buildUrlFormat) {
    const toPath = pathToRegexp.compile(config.buildUrlFormat);
    const revisionUrl = toPath({ revision });
    revision = {
      value: revision,
      url: revisionUrl,
    };

    if (parentRevision) {
      const parentRevisionUrl = toPath({ revision: parentRevision });
      parentRevision = {
        value: parentRevision,
        url: parentRevisionUrl,
      };
    }
  }

  const build = {
    meta: {
      author: name,
      branch,
      parentRevision,
      revision,
      subject,
      timestamp,
      ...(opts.meta || {}),
    },
    artifacts,
  };

  return build;
}
