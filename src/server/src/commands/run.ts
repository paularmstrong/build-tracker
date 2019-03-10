/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as path from 'path';
import { Argv } from 'yargs';
import run, { ServerConfig } from '../server';

export const command = 'run';

export const description = 'Run the Build Tracker server';

interface Args {
  config: string;
}

const group = 'Run';

export const builder = (yargs): Argv<Args> =>
  yargs.usage(`Usage: $0 ${command}`).option('config', {
    alias: 'c',
    coerce: v => path.join(process.cwd(), v),
    default: 'build-tracker.config.js',
    description: 'path to the build-tracker config file',
    group,
    normalize: true
  });

export const handler = (args: Args): void => {
  const config = require(args.config) as ServerConfig;
  run(config);
};
