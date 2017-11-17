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
  artifacts: { [name: string]: Artifact }
};

export type ArtifactDelta = {
  size: number,
  sizePercent: number,
  gzipSize: number,
  gzipSizePercent: number,
  hashChanged: boolean
};

export type BuildDelta = {
  meta: BuildMeta,
  artifactDeltas: Array<{ [name: string]: ArtifactDelta }>,
  deltas: Array<ArtifactDelta>
};

export type ComparisonMatrix = Array<Array<string | ArtifactDelta>>;
