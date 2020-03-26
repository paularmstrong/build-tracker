/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Argv } from 'yargs';
import { getConfig, statArtifacts } from '@build-tracker/api-client';

export const command = 'stat-artifacts';

export const description = 'Compute your artifact stats';

interface Args {
  config?: string;
  out: boolean;
}

const group = 'Stat artifacts';

export const builder = (yargs): Argv<Args> =>
  yargs
    .usage(`Usage: $0 ${command}`)
    .option('config', {
      alias: 'c',
      description: 'Override path to the build-tracker CLI config file',
      group,
      normalize: true,
    })
    .option('out', {
      alias: 'o',
      default: true,
      description: 'Write the stats to stdout',
      group,
      type: 'boolean',
    });

export const handler = async (args: Args): Promise<void> => {
  const config = await getConfig(args.config);

  const artifacts = statArtifacts(config);

  if (args.out) {
    const fileOut = Array.from(artifacts).reduce((memo, [artifactName, stat]) => {
      memo[artifactName] = stat;
      return memo;
    }, {});
    // @ts-ignore
    process.stdout.write(JSON.stringify(fileOut, null, 2));
  }
};
