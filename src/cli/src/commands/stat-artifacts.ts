/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Argv } from 'yargs';
import getConfig from '../modules/config';
import glob from 'glob';
import path from 'path';
import readfile from '../modules/readfile';

export const command = 'stat-artifacts';

export const description = 'Compute your artifact stats';

interface Args {
  config?: string;
  out: boolean;
}

interface Stat {
  hash: string;
  stat: number;
  gzip: number;
  brotli: number;
}

const group = 'Stat artifacts';

const defaultNameMapper = (fileName: string): string => fileName;

export const builder = (yargs): Argv<Args> =>
  yargs
    .usage(`Usage: $0 ${command}`)
    .option('config', {
      alias: 'c',
      description: 'Override path to the build-tracker CLI config file',
      group,
      normalize: true
    })
    .option('out', {
      alias: 'o',
      default: true,
      description: 'Write the stats to stdout',
      group,
      type: 'boolean'
    });

export const handler = async (args: Args): Promise<{ artifacts: Map<string, Stat> }> => {
  const { artifacts: artifactGlobs, baseDir, cwd, getFilenameHash, nameMapper = defaultNameMapper } = await getConfig(
    args.config
  );

  const artifacts = new Map();
  artifactGlobs.forEach(fileGlob => {
    glob.sync(path.resolve(cwd, fileGlob)).forEach(filePath => {
      const sizes = readfile(filePath, getFilenameHash);
      artifacts.set(nameMapper(path.relative(baseDir, filePath).replace(`.${sizes.hash}`, '')), sizes);
    });
  }, []);

  if (args.out) {
    const fileOut = Array.from(artifacts).reduce((memo, [artifactName, stat]) => {
      memo[artifactName] = stat;
      return memo;
    }, {});
    // @ts-ignore
    process.stdout.write(JSON.stringify(fileOut, null, 2));
  }

  return Promise.resolve({
    artifacts
  });
};
