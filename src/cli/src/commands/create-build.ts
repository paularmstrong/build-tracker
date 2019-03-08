/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Git from '../modules/git';
import { Argv } from 'yargs';
import getConfig from '../modules/config';
import { handler as statArtifacts } from './stat-artifacts';

export const command = 'create-build';

export const description = 'Construct a build for the current commit';

interface Args {
  config?: string;
}

const group = 'Create a build';

export const builder = (yargs): Argv<Args> =>
  yargs.usage(`Usage: $0 ${command}`).option('config', {
    alias: 'c',
    description: 'Override path to the build-tracker CLI config file',
    group,
    normalize: true
  });

export const handler = async (args: Args): Promise<{}> => {
  const config = await getConfig(args.config);
  const isDirty = await Git.isDirty(config.cwd);
  if (isDirty) {
    throw new Error('Current work tree is dirty. Please commit all changes before proceeding');
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
  const parentRevision = await Git.getParentRevision(defaultBranch, config.cwd);
  const revision = await Git.getCurrentRevision(config.cwd);
  const { timestamp, name, subject } = await Git.getRevisionDetails(revision, config.cwd);

  return Promise.resolve({
    meta: {
      parentRevision,
      revision,
      timestamp,
      author: name,
      subject
    },
    artifacts
  });
};
