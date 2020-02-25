/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Git from '../modules/git';
import { Argv } from 'yargs';
import { BuildMetaItem } from '@build-tracker/build';
import getConfig from '../modules/config';
import pathToRegexp from 'path-to-regexp';
import { handler as statArtifacts } from './stat-artifacts';

export const command = 'create-build';

export const description = 'Construct a build for the current commit';

interface Args {
  branch?: string;
  config?: string;
  out: boolean;
  'parent-revision'?: string;
  'skip-dirty-check': boolean;
}

const group = 'Create a build';

export const builder = (yargs): Argv<Args> =>
  yargs
    .usage(`Usage: $0 ${command}`)
    .option('branch', {
      alias: 'b',
      description: 'Set the branch name and do not attempt to read from git',
      group,
      type: 'string'
    })
    .option('config', {
      alias: 'c',
      description: 'Override path to the build-tracker CLI config file',
      group,
      normalize: true
    })
    .option('out', {
      alias: 'o',
      default: true,
      description: 'Write the build to stdout',
      group,
      type: 'boolean'
    })
    .option('parent-revision', {
      description: 'Manually provide the parent revision instead of reading it automatically',
      group,
      type: 'string'
    })
    .option('skip-dirty-check', {
      default: false,
      description: 'Skip the git work tree state check',
      group,
      type: 'boolean'
    });

export const handler = async (args: Args): Promise<{}> => {
  const config = await getConfig(args.config);
  if (!args['skip-dirty-check']) {
    const isDirty = await Git.isDirty(config.cwd);
    if (isDirty) {
      throw new Error('Current work tree is dirty. Please commit all changes before proceeding');
    }
  }

  const { artifacts: artifactStats } = await statArtifacts({ config: args.config, out: false });
  const artifacts = Array.from(artifactStats).reduce((memo, [artifactName, stat]) => {
    memo.push({
      name: artifactName,
      hash: stat.hash,
      sizes: {
        stat: stat.stat,
        gzip: stat.gzip,
        brotli: stat.brotli
      }
    });
    return memo;
  }, []);

  const defaultBranch = await Git.getDefaultBranch(config.cwd);
  const branch = args.branch ? args.branch : await Git.getBranch(config.cwd);
  let revision: BuildMetaItem = await Git.getCurrentRevision(config.cwd);
  let parentRevision: BuildMetaItem =
    args['parent-revision'] ||
    (branch !== defaultBranch
      ? await Git.getMergeBase(defaultBranch, config.cwd)
      : await Git.getParentRevision(revision));
  const { timestamp, name, subject } = await Git.getRevisionDetails(revision, config.cwd);

  if (config.buildUrlFormat) {
    const toPath = pathToRegexp.compile(config.buildUrlFormat);
    const revisionUrl = toPath({ revision });
    revision = {
      value: revision,
      url: revisionUrl
    };

    if (parentRevision) {
      const parentRevisionUrl = toPath({ revision: parentRevision });
      parentRevision = {
        value: parentRevision,
        url: parentRevisionUrl
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
      timestamp
    },
    artifacts
  };

  if (args.out) {
    process.stdout.write(JSON.stringify(build, null, 2));
  }

  return Promise.resolve(build);
};
