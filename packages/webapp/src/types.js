export type BuildMeta = {
  revision: string,
  timestamp: number
};

export type BundleStat = {
  hash: string,
  name: string,
  size: number,
  gzipSize: number
};

export type Build = {
  build: BuildMeta,
  stats: { [name: string]: BundleStat }
};
