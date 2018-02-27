/**
 * Generic Types
 */

declare type BT$BuildMeta = {
  branch?: string,
  revision: string,
  timestamp: number
};

declare type BT$Artifact = {
  hash: string,
  name: string,
  stat: number,
  gzip: number
};

declare type BT$Build = {|
  meta: BT$BuildMeta,
  artifacts: { [name: string]: BT$Artifact }
|};

/**
 * Comparison Matrix
 */

declare type BT$BuildDelta = {|
  meta: BT$BuildMeta,
  artifactDeltas: Array<{ [name: string]: BT$DeltaCellType }>,
  deltas: Array<BT$TotalDeltaCellType>
|};
declare type BT$TextCellType = {|
  type: 'text',
  text: string
|};

declare type BT$DeltaCellType = {|
  type: 'delta',
  stat: number,
  statPercent: number,
  gzip: number,
  gzipPercent: number,
  hashChanged: boolean
|};

declare type BT$TotalCellType = {|
  type: 'total',
  stat: number,
  gzip: number
|};

declare type BT$TotalDeltaCellType = {|
  type: 'totalDelta',
  stat: number,
  statPercent: number,
  gzip: number,
  gzipPercent: number
|};

declare type BT$RevisionCellType = {|
  type: 'revision',
  revision: string
|};

declare type BT$RevisionDeltaCellType = {|
  type: 'revisionDelta',
  revision: string,
  deltaIndex: number,
  againstRevision: string
|};

declare type BT$ArtifactCellType = {|
  type: 'artifact',
  text: string
|};

declare type BT$BodyCellType = BT$ArtifactCellType | BT$DeltaCellType | BT$TotalCellType;
declare type BT$HeaderCellType = BT$TextCellType | BT$RevisionCellType | BT$RevisionDeltaCellType;

declare type BT$ComparisonMatrix = {
  header: Array<BT$HeaderCellType>,
  total: Array<BT$BodyCellType>,
  body: Array<Array<BT$BodyCellType>>
};

/**
 * Application
 */

declare type BT$Thresholds = {|
  stat?: number,
  statPercent?: number,
  gzip?: number,
  gzipPercent?: number
|};

declare type BT$ArtifactFilters = Array<RegExp>;

declare type BT$AppConfig = {|
  artifactFilters?: BT$ArtifactFilters,
  thresholds?: BT$Thresholds
|};
