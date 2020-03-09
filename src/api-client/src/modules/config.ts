/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { ComparisonMatrix } from '@build-tracker/comparator';
import cosmiconfig from 'cosmiconfig';
import { Artifact, BuildMeta } from '@build-tracker/build';

interface BuildJson {
  meta: BuildMeta;
  artifacts: Array<Artifact>;
}

export interface ApiReturn {
  build: BuildJson;
  parentBuild: BuildJson;
  json: ComparisonMatrix;
  markdown: string;
  csv: string;
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
