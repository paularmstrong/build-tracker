/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Argv } from 'yargs';
import { getBuild, getConfig } from '@build-tracker/api-client';

export const command = 'get-build';

export const description = 'Retrieve a build by revision';

export interface Args {
  revision: string;
  config?: string;
  out: boolean;
}

const group = 'Retrieve a build';

export const getBuildOptions = (yargs): Argv<Args> =>
  yargs
    .option('revision', {
      alias: 'r',
      description: 'Get the build using revision',
      group,
      type: 'string',
    })
    .option('config', {
      alias: 'c',
      description: 'Override path to the build-tracker CLI config file',
      group,
      normalize: true,
    });

export const builder = (yargs): Argv<Args> =>
  getBuildOptions(yargs).usage(`Usage: $0 ${command}`).option('out', {
    alias: 'o',
    default: true,
    description: 'Write the build to stdout',
    group,
    type: 'boolean',
  });

export const handler = async (args: Args): Promise<void> => {
  const config = await getConfig(args.config);
  const { revision } = args;
  const build = await getBuild(config, revision);

  if (args.out) {
    process.stdout.write(JSON.stringify(build, null, 2));
  }
};
