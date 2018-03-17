// @flow

/**
 * Generic Types
 */

export type BT$BuildMetaItem = string | { value: string, url: string };

export type BT$BuildMeta = {
  branch?: BT$BuildMetaItem,
  revision: BT$BuildMetaItem,
  timestamp: number,
  [key: string]: BT$BuildMetaItem
};

export type BT$Artifact = {
  hash: string,
  name: string,
  stat: number,
  gzip: number
};

export type BT$Build = {|
  meta: BT$BuildMeta,
  artifacts: { [name: string]: BT$Artifact }
|};

/**
 * Comparison Matrix
 */

export type BT$BuildDelta = {|
  meta: BT$BuildMeta,
  artifactDeltas: Array<{ [name: string]: BT$DeltaCellType }>,
  deltas: Array<BT$TotalDeltaCellType>
|};

export type BT$TextCellType = {|
  type: 'text',
  text: string
|};

export type BT$DeltaCellType = {|
  type: 'delta',
  stat: number,
  statPercent: number,
  gzip: number,
  gzipPercent: number,
  hashChanged: boolean
|};

export type BT$TotalCellType = {|
  type: 'total',
  stat: number,
  gzip: number
|};

export type BT$TotalDeltaCellType = {|
  type: 'totalDelta',
  stat: number,
  statPercent: number,
  gzip: number,
  gzipPercent: number
|};

export type BT$RevisionCellType = {|
  type: 'revision',
  revision: string
|};

export type BT$RevisionDeltaCellType = {|
  type: 'revisionDelta',
  revision: string,
  deltaIndex: number,
  againstRevision: string
|};

export type BT$ArtifactCellType = {|
  type: 'artifact',
  text: string
|};

export type BT$BodyCellType = BT$ArtifactCellType | BT$DeltaCellType | BT$TotalCellType;
export type BT$HeaderCellType = BT$TextCellType | BT$RevisionCellType | BT$RevisionDeltaCellType;

export type BT$ComparisonMatrix = {
  header: Array<BT$HeaderCellType>,
  total: Array<BT$BodyCellType>,
  body: Array<Array<BT$BodyCellType>>
};

/**
 * Application
 */

export type BT$Thresholds = {|
  stat?: number,
  statPercent?: number,
  gzip?: number,
  gzipPercent?: number
|};

export type BT$ArtifactFilters = Array<RegExp>;

export type BT$AppConfig = {|
  artifactFilters?: BT$ArtifactFilters,
  thresholds?: BT$Thresholds
|};
