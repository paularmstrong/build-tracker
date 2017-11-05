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
  gzipSize: number
};

export type BuildDelta = {
  ...Build,
  artifactDeltas: Array<{ [name: string]: ArtifactDelta }>,
  deltas: Array<ArtifactDelta>
};
