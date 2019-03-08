/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Argv } from 'yargs';
import cosmiconfig from 'cosmiconfig';
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

const group = 'Run';

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

export const handler = async (args: Args): Promise<{ configPath: string; files: Map<string, Stat> }> => {
  const { config: configPath } = args;

  const explorer = cosmiconfig('build-tracker');
  let result;
  try {
    result = !configPath ? await explorer.search() : await explorer.load(configPath);
  } catch (e) {
    throw new Error('Could not find configuration file');
  }

  const { artifacts, baseDir, cwd, getFilenameHash, nameMapper = defaultNameMapper } = result.config;
  const files = new Map();
  artifacts.forEach(fileGlob => {
    glob.sync(path.resolve(cwd, fileGlob)).forEach(filePath => {
      const sizes = readfile(filePath, getFilenameHash);
      files.set(nameMapper(path.relative(baseDir, filePath).replace(`.${sizes.hash}`, '')), sizes);
    });
  }, []);

  if (args.out) {
    const fileOut = Array.from(files).reduce((memo, [artifactName, stat]) => {
      memo[artifactName] = stat;
      return memo;
    }, {});
    // @ts-ignore
    process.stdout.write(JSON.stringify(fileOut, null, 2));
  }

  return Promise.resolve({
    configPath: result.filepath,
    files
  });
};
