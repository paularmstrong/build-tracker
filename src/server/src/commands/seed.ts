/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as path from 'path';
import { Argv } from 'yargs';
import Build from '@build-tracker/build';
import glob from 'glob';
import { ServerConfig } from '../server';

export const command = 'seed';

export const description = 'Seed your database with fixture data';

interface Args {
  config: string;
}

const group = 'Seed';

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
  const fixturePath = path.dirname(require.resolve('@build-tracker/fixtures'));

  await config.setup();

  glob.sync(`${path.join(fixturePath, 'builds')}/*.json`).forEach(async build => {
    const buildData = require(build);
    await config.queries.build.insert(new Build(buildData.meta, buildData.artifacts));
  });

  return Promise.resolve();
};
