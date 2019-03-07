/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Argv } from 'yargs';
import cosmiconfig from 'cosmiconfig';
import glob from 'glob';
import path from 'path';
import readfile from '../modules/readfile';

export const command = 'run';

export const description = 'Run the Build Tracker server';

interface Args {
  config?: string;
}

const group = 'Run';

const defaultNameMapper = (fileName: string): string => fileName;

export const builder = (yargs): Argv<Args> =>
  yargs.usage(`Usage: $0 ${command}`).option('config', {
    alias: 'c',
    description: 'Override path to the build-tracker CLI config file',
    group,
    normalize: true
  });

export const handler = async (args: Args): Promise<{}> => {
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

  return Promise.resolve({
    configPath: result.filepath,
    files: Array.from(files)
  });
};
