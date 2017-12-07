export type BuildMeta = {
  revision: string,
  timestamp: number
};

export type Artifact = {
  hash: string,
  name: string,
  size: number,
  gzip: number
};

export type Build = {
  meta: BuildMeta,
  artifacts: { [name: string]: Artifact }
};
