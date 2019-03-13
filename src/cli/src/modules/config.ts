/**
 * Copyright (c) 2019 Paul Armstrong
 */
import cosmiconfig from 'cosmiconfig';

interface Config {
  applicationUrl: string;
  artifacts: Array<string>;
  baseDir: string;
  cwd: string;
  getFilenameHash?: (filename: string) => string | void;
  nameMapper?: (filename: string) => string;
}

export default async function getConfig(path?: string): Promise<Config> {
  const explorer = cosmiconfig('build-tracker');
  let result;
  try {
    result = !path ? await explorer.search() : await explorer.load(path);
  } catch (e) {
    throw new Error('Could not find configuration file');
  }

  return result.config;
}
