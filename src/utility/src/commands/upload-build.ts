/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Argv } from 'yargs';
import createBuild from '../modules/create-build';
import getConfig from '../modules/config';
import uploadBuild from '../modules/upload-build';
import { Args as BuildArgs, getBuildOptions } from './create-build';

export const command = 'upload-build';

export const description = 'Upload a build for the current commit';

type Args = BuildArgs;

export const builder = (yargs): Argv<Args> => getBuildOptions(yargs).usage(`Usage: $0 ${command}`);

export const handler = async (args: Args): Promise<void> => {
  const config = await getConfig(args.config);
  const build = await createBuild(config, {
    branch: args.branch,
    meta: args.meta,
    parentRevision: args['parent-revision'],
    skipDirtyCheck: args['skip-dirty-check']
  });

  await uploadBuild(config, build, process.env.BT_API_AUTH_TOKEN, {
    log: input => {
      process.stdout.write(input);
    },
    error: input => {
      process.stderr.write(input);
    }
  });
};
