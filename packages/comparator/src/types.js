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

export type TotalDelta = {
  size: number,
  sizePercent: number,
  gzipSize: number,
  gzipSizePercent: number
};

export type BuildDelta = {
  meta: BuildMeta,
  artifactDeltas: Array<{ [name: string]: DeltaCell }>,
  deltas: Array<TotalDeltaCell>
};

export type TextCell = {
  type: string,
  text: string
};

export type DeltaCell = {
  type: text,
  size: number,
  sizePercent: number,
  gzipSize: number,
  gzipSizePercent: number,
  hashChanged: boolean
};

export type TotalCell = {
  type: text,
  size: number,
  gzipSize: number
};

export type TotalDeltaCell = {
  type: text,
  ...TotalDelta
};

export type RevisionHeaderCell = {
  type: text,
  revision: string
};

export type RevisionDeltaCell = {
  ...RevisionHeaderCell,
  deltaIndex: number,
  againstRevision: string
};

export type MatrixCell = TextCell | TotalCell | TotalDeltaCell | DeltaCell | RevisionDeltaCell | RevisionHeaderCell;

export type ComparisonMatrix = Array<Array<MatrixCell>>;
