/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as path from 'path';
import { Argv } from 'yargs';
import { ServerConfig } from '../server';

export const command = 'setup';

export const description = 'Run the Build Tracker setup';

interface Args {
  config: string;
}

const group = 'Setup';

export const builder = (yargs): Argv<Args> =>
  yargs.usage(`Usage: $0 ${command}`).option('config', {
    alias: 'c',
    coerce: v => path.join(process.cwd(), v),
    default: 'build-tracker.config.js',
    description: 'path to the build-tracker config file',
    group,
    normalize: true
  });

export const handler = async (args: Args): Promise<void> => {
  const config = require(args.config) as ServerConfig;
  await config.setup();
  console.log('Successfully set up your database');
};
