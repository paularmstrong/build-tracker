/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Config } from './config';
import glob from 'glob';
import path from 'path';
import readfile from './readfile';

export interface Stat {
  hash: string;
  stat: number;
  gzip: number;
  brotli: number;
}

const defaultNameMapper = (fileName: string): string => fileName;

export default function statArtifacts(config: Config): Map<string, Stat> {
  const { artifacts: artifactGlobs, baseDir, cwd, getFilenameHash, nameMapper = defaultNameMapper } = config;

  const artifacts = new Map();

  artifactGlobs.forEach((fileGlob) => {
    glob.sync(path.resolve(cwd, fileGlob), { nodir: true }).forEach((filePath) => {
      const sizes = readfile(filePath, getFilenameHash);
      artifacts.set(nameMapper(path.relative(baseDir, filePath).replace(`.${sizes.hash}`, '')), sizes);
    });
  }, []);

  return artifacts;
}
