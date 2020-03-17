/**
 * Copyright (c) 2019 Paul Armstrong
 */
import cosmiconfig from 'cosmiconfig';

export interface ApiReturn {
  comparatorData: string;
  summary: Array<string>;
}

export interface Config {
  applicationUrl: string;
  artifacts: Array<string>;
  baseDir: string;
  cwd: string;
  buildUrlFormat?: string;
  getFilenameHash?: (filename: string) => string | void;
  nameMapper?: (filename: string) => string;
  onCompare?: (data: ApiReturn) => Promise<void>;
}

export default async function getConfig(path?: string): Promise<Config> {
  const explorer = cosmiconfig('build-tracker');
  let result;
  try {
    result = !path ? await explorer.search() : await explorer.load(path);
  } catch (e) {
    if (e.code === 'ENOENT') {
      throw new Error('Could not find configuration file');
    } else {
      throw e;
    }
  }

  return {
    baseDir: process.cwd(),
    cwd: process.cwd(),
    ...result.config
  };
}
