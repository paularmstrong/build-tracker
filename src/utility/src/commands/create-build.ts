/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Argv } from 'yargs';
import createBuild from '../modules/create-build';
import getConfig from '../modules/config';

export const command = 'create-build';

export const description = 'Construct a build for the current commit';

export interface Args {
  'parent-revision'?: string;
  'skip-dirty-check': boolean;
  branch?: string;
  config?: string;
  meta?: string;
  out: boolean;
}

const group = 'Create a build';

export const getBuildOptions = (yargs): Argv<Args> =>
  yargs
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
    .option('meta', {
      description: 'JSON-encoded extra meta information to attach to the build',
      group,
      type: 'string'
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

export const builder = (yargs): Argv<Args> =>
  getBuildOptions(yargs)
    .usage(`Usage: $0 ${command}`)
    .option('out', {
      alias: 'o',
      default: true,
      description: 'Write the build to stdout',
      group,
      type: 'boolean'
    });

export const handler = async (args: Args): Promise<{}> => {
  const config = await getConfig(args.config);

  const build = await createBuild(config, {
    branch: args.branch,
    meta: args.meta,
    parentRevision: args['parent-revision'],
    skipDirtyCheck: args['skip-dirty-check']
  });

  if (args.out) {
    process.stdout.write(JSON.stringify(build, null, 2));
  }

  return Promise.resolve(build);
};
