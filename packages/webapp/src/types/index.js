export type BuildMeta = {
  revision: string,
  timestamp: number
};

export type Artifact = {
  hash: string,
  name: string,
  size: number,
  gzipSize: number
};

export type Build = {
  meta: BuildMeta,
  stats: { [name: string]: Artifact }
};
